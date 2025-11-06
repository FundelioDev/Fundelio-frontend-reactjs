import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { httpMethods } from '../data/data';
import { Permission } from '../data/schema';
import { toast } from 'react-toastify';
import { usePermissions } from '@/components/dashboard/permissions/context/permissions-context';
import { permissionsApi } from '@/api-client';
import { useLanguage } from '@/contexts/language-context';

// Schema cho form thêm mới
const addPermissionSchema = z.object({
  name: z.string().min(1, 'Tên permission là bắt buộc'),
  apiPath: z.string().min(1, 'API path là bắt buộc'),
  httpMethod: z.enum(['GET', 'DELETE', 'POST', 'PUT', 'PATCH'] as const),
  module: z.string().default(''),
});

// Schema cho form chỉnh sửa - tất cả field đều optional
const editPermissionSchema = z.object({
  name: z.string().optional(),
  apiPath: z.string().optional(),
  httpMethod: z
    .enum(['GET', 'DELETE', 'POST', 'PUT', 'PATCH'] as const)
    .optional(),
  module: z.string().optional(),
});

interface PermissionsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Permission | null;
}

const getMethodLabel = (value: string) => {
  const method = httpMethods.find((m) => m.value === value);
  return method ? method.label : value;
};

export function PermissionsFormDialog({
  open,
  onOpenChange,
  currentRow,
}: PermissionsFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableModules, setAvailableModules] = useState<string[]>([]);
  const { refetch } = usePermissions();
  const { t } = useLanguage();

  const isEditMode = !!currentRow;
  const schema = isEditMode ? editPermissionSchema : addPermissionSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: currentRow?.name || '',
      apiPath: currentRow?.apiPath || '',
      httpMethod: currentRow?.httpMethod || undefined,
      module: currentRow?.module || '',
    },
  });

  // Reset form khi currentRow thay đổi
  useEffect(() => {
    if (currentRow) {
      form.reset({
        name: currentRow.name,
        apiPath: currentRow.apiPath,
        httpMethod: currentRow.httpMethod,
        module: currentRow.module,
      });
    }
  }, [currentRow, form]);

  // Fetch modules khi dialog mở
  useEffect(() => {
    if (open) {
      fetchModules();
    }
  }, [open]);

  const fetchModules = async () => {
    try {
      const response = await permissionsApi.getModules();
      if (response.data.success) {
        setAvailableModules(response.data.data);
      } else {
        toast.error('Không thể tải danh sách modules');
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast.error('Không thể tải danh sách modules');
      setAvailableModules([]);
    }
  };

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {
      // Xử lý payload
      let payload = { ...values };

      // Xử lý trường module
      if (payload.module === 'none' || !payload.module) {
        payload.module = '';
      }

      // Trong trường hợp edit
      if (isEditMode && currentRow) {
        // Chỉ gửi những field đã thay đổi
        const changedFields = Object.entries(values).reduce(
          (acc, [key, value]) => {
            if (value !== currentRow[key as keyof Permission]) {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, any>
        );

        // Xử lý module
        if (changedFields.module === 'none' || !changedFields.module) {
          delete changedFields.module;
        }

        // Nếu không có thay đổi gì, đóng dialog
        if (Object.keys(changedFields).length === 0) {
          onOpenChange(false);
          return;
        }

        const response = await permissionsApi.updatePermission(
          currentRow.permissionId,
          changedFields
        );
        if (!response.data.success) {
          toast.error(response.data.message || 'Có lỗi xảy ra');
          return;
        }
        toast.success(response.data.message);
      } else {
        // Đảm bảo payload cho create có đầy đủ các trường bắt buộc
        const { name, apiPath, httpMethod, module } = values;
        const createPayload = {
          name: name as string,
          apiPath: apiPath as string,
          httpMethod: httpMethod as 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH',
          ...(module !== 'none' && module ? { module } : {}),
        };
        const response = await permissionsApi.createPermission(createPayload);
        if (!response.data.success) {
          toast.error(response.data.message || 'Có lỗi xảy ra');
          return;
        }
        toast.success(response.data.message);
      }

      await refetch();
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:bg-zinc-800">
        <DialogHeader>
          <DialogTitle>
            {currentRow ? t('permissionEditTitle') : t('permissionAddTitle')}
          </DialogTitle>
          <DialogDescription>
            {currentRow ? t('permissionEditDesc') : t('permissionAddDesc')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('permissionName')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('permissionNamePlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('permissionApiPath')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('permissionApiPathPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="httpMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('permissionHttpMethod')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
                          {field.value
                            ? field.value
                            : t('permissionHttpMethodPlaceholder')}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {httpMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="module"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('permissionModule')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || 'none'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('permissionModulePlaceholder')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">{t('none')}</SelectItem>
                      {availableModules.map((module) => (
                        <SelectItem key={module} value={module}>
                          {module}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('permissionUpdating') : t('submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
