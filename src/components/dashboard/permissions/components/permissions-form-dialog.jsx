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
import { toast } from 'react-toastify';
import { usePermissions } from '@/components/dashboard/permissions/context/permissions-context';
import { permissionsApi } from '@/api/permissionApi';

// Schema cho form thêm mới
const addPermissionSchema = z.object({
  name: z.string().min(1, 'Tên permission là bắt buộc'),
  apiPath: z.string().min(1, 'API path là bắt buộc'),
  httpMethod: z.enum(['GET', 'DELETE', 'POST', 'PUT', 'PATCH']),
  module: z.string().default(''),
});

// Schema cho form chỉnh sửa - tất cả field đều optional
const editPermissionSchema = z.object({
  name: z.string().optional(),
  apiPath: z.string().optional(),
  httpMethod: z
    .enum(['GET', 'DELETE', 'POST', 'PUT', 'PATCH'])
    .optional(),
  module: z.string().optional(),
});

const getMethodLabel = (value) => {
  const method = httpMethods.find((m) => m.value === value);
  return method ? method.label : value;
};

export function PermissionsFormDialog({
  open,
  onOpenChange,
  currentRow,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableModules, setAvailableModules] = useState([]);
  const { refetch } = usePermissions();

  const isEditMode = !!currentRow;
  const schema = isEditMode ? editPermissionSchema : addPermissionSchema;

  const form = useForm({
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
      if (response?.data?.success) {
        setAvailableModules(response.data.data || []);
      } else {
        toast.error(response?.data?.message || 'Không thể tải danh sách modules');
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Không thể tải danh sách modules';
      toast.error(errorMessage);
      setAvailableModules([]);
    }
  };

  const onSubmit = async (values) => {
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
            if (value !== currentRow[key]) {
              acc[key] = value;
            }
            return acc;
          },
          {}
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
        if (!response?.data?.success) {
          toast.error(response?.data?.message || 'Có lỗi xảy ra');
          return;
        }
        toast.success(response?.data?.message || 'Cập nhật thành công');
      } else {
        // Đảm bảo payload cho create có đầy đủ các trường bắt buộc
        const { name, apiPath, httpMethod, module } = values;
        const createPayload = {
          name: name,
          apiPath: apiPath,
          httpMethod: httpMethod,
          ...(module !== 'none' && module ? { module } : {}),
        };
        const response = await permissionsApi.createPermission(createPayload);
        if (!response?.data?.success) {
          toast.error(response?.data?.message || 'Có lỗi xảy ra');
          return;
        }
        toast.success(response?.data?.message || 'Tạo permission thành công');
      }

      await refetch();
      onOpenChange(false);
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-darker-2 border-border transition-colors duration-300">
        <DialogHeader>
          <DialogTitle className="text-text-primary dark:text-white transition-colors duration-300">
            {currentRow ? 'Chỉnh sửa Permission' : 'Thêm Permission'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground dark:text-text-white transition-colors duration-300">
            {currentRow ? 'Cập nhật thông tin permission' : 'Thêm permission mới vào hệ thống'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-primary dark:text-white transition-colors duration-300">Tên permission</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên permission"
                      {...field}
                      className="bg-white dark:bg-darker-2 border-border text-text-primary dark:text-white transition-colors duration-300"
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
                  <FormLabel className="text-text-primary dark:text-white transition-colors duration-300">Đường dẫn API</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập đường dẫn API"
                      {...field}
                      className="bg-white dark:bg-darker-2 border-border text-text-primary dark:text-white transition-colors duration-300"
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
                  <FormLabel className="text-text-primary dark:text-white transition-colors duration-300">HTTP Method</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-darker-2 border-border text-text-primary dark:text-white transition-colors duration-300">
                        <SelectValue>
                          {field.value
                            ? field.value
                            : 'Chọn HTTP Method'}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-darker-2 border-border transition-colors duration-300">
                      {httpMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value} className="text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-darker-2/70 transition-colors duration-300">
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
                  <FormLabel className="text-text-primary dark:text-white transition-colors duration-300">Module</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || 'none'}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-darker-2 border-border text-text-primary dark:text-white transition-colors duration-300">
                        <SelectValue
                          placeholder="Chọn module"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-darker-2 border-border transition-colors duration-300">
                      <SelectItem value="none" className="text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-darker-2/70 transition-colors duration-300">Không có</SelectItem>
                      {availableModules.map((module) => (
                        <SelectItem key={module} value={module} className="text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-darker-2/70 transition-colors duration-300">
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
                className="hover:bg-gray-100 dark:hover:bg-darker-2 transition-colors duration-300"
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Đang cập nhật...' : 'Gửi'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

