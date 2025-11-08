'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog.jsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Search } from 'lucide-react';
import { usePermissions } from '../context/permissions-context';
import { toast } from 'react-toastify';
import { permissionsApi } from '@/api/permissionApi';
import { motion } from 'framer-motion';

const formSchema = z.object({
  moduleName: z
    .string()
    .min(1, 'Tên module không được để trống')
    .refine((value) => /^[A-Z]+$/.test(value), {
      message: 'Tên module phải viết hoa và không chứa ký tự đặc biệt',
    }),
});

export function CreateModuleDialog({ open, onOpenChange }) {
  const { permissions = [], modules = [], refetch } = usePermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc ra các permission chưa có module
  const availablePermissions = permissions.filter(
    (p) =>
      !p.module ||
      p.module === '' ||
      p.module === null ||
      p.module === undefined
  );

  // Lọc permissions dựa trên tìm kiếm
  const filteredPermissions = availablePermissions.filter(
    (p) =>
      searchTerm === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.apiPath.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.httpMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      moduleName: '',
    },
  });

  // Reset form khi dialog đóng
  useEffect(() => {
    if (!open) {
      form.reset();
      setSelectedPermissions([]);
      setSearchTerm('');
    }
  }, [open, form]);

  // Toggle permission (chọn hoặc bỏ chọn)
  const togglePermission = (permissionId) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(
        selectedPermissions.filter((id) => id !== permissionId)
      );
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  const onSubmit = async (values) => {
    if (selectedPermissions.length === 0) {
      toast.error('Vui lòng chọn ít nhất một permission');
      return;
    }

    setIsLoading(true);
    try {
      if (modules.includes(values.moduleName)) {
        form.setError('moduleName', { message: 'Tên module đã tồn tại' });
        setIsLoading(false);
        return;
      }

      const response = await permissionsApi.createModule({
        moduleName: values.moduleName,
        permissionIds: selectedPermissions,
      });

      if (!response?.data?.success) {
        toast.error(response?.data?.message || 'Không thể tạo module');
        return;
      }

      toast.success(response?.data?.message || 'Tạo module thành công');
      onOpenChange(false);
      refetch();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Không thể tạo module';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md p-6 bg-white dark:bg-darker-2 border-border transition-colors duration-300'>
        <DialogHeader>
          <DialogTitle className='text-text-primary dark:text-white transition-colors duration-300'>
            Thêm Module
          </DialogTitle>
          <DialogDescription className='text-muted-foreground dark:text-text-white transition-colors duration-300'>
            Tạo module mới và chọn các permissions cho module
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <FormField
              control={form.control}
              name='moduleName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-text-primary dark:text-white transition-colors duration-300'>
                    Tên Module
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nhập tên module (VD: USERS)'
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                      className='bg-white dark:bg-darker-2 border-border text-text-primary dark:text-white transition-colors duration-300'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <FormLabel className='text-text-primary dark:text-white transition-colors duration-300'>
                  Permissions
                </FormLabel>
                <div className='flex items-center gap-2'>
                  <Search className='h-4 w-4 text-text-primary dark:text-white transition-colors duration-300' />
                  <Input
                    placeholder='Tìm kiếm...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='h-8 w-48 bg-white dark:bg-darker-2 border-border text-text-primary dark:text-white transition-colors duration-300'
                  />
                  <Badge
                    variant='secondary'
                    className='font-medium dark:bg-darker-2 dark:text-white transition-colors duration-300'
                  >
                    {selectedPermissions.length} đã chọn
                  </Badge>
                </div>
              </div>

              <div className='border border-border rounded-md overflow-hidden bg-white dark:bg-darker-2 transition-colors duration-300'>
                <ScrollArea className='h-[300px]'>
                  {filteredPermissions.length === 0 ? (
                    <div className='flex items-center justify-center h-full p-4 text-center text-muted-foreground dark:text-text-white transition-colors duration-300'>
                      <p>Không tìm thấy permission nào</p>
                    </div>
                  ) : (
                    <div className='divide-y divide-border dark:divide-darker transition-colors duration-300'>
                      {filteredPermissions.map((permission) => {
                        const isSelected = selectedPermissions.includes(
                          permission.permissionId
                        );

                        return (
                          <motion.div
                            key={permission.permissionId}
                            className={`flex items-center justify-between p-3 hover:bg-accent dark:hover:bg-darker-2/70 cursor-pointer transition-colors duration-300 ${
                              isSelected
                                ? 'bg-accent/40 dark:bg-primary/20'
                                : ''
                            }`}
                            onClick={() =>
                              togglePermission(permission.permissionId)
                            }
                            whileTap={{ scale: 0.98 }}
                            transition={{
                              type: 'spring',
                              stiffness: 500,
                              damping: 30,
                            }}
                          >
                            <div className='flex-1'>
                              <div className='flex items-start gap-2'>
                                <Badge
                                  variant='outline'
                                  className={`mt-0.5 text-xs whitespace-nowrap border-border dark:bg-darker-2 dark:text-white transition-colors duration-300 ${
                                    isSelected
                                      ? 'border-primary/50 bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-400'
                                      : ''
                                  }`}
                                >
                                  {permission.httpMethod}
                                </Badge>
                                <div>
                                  <p
                                    className={`font-medium leading-tight text-text-primary dark:text-white transition-colors duration-300 ${
                                      isSelected
                                        ? 'text-primary dark:text-primary-400'
                                        : ''
                                    }`}
                                  >
                                    {permission.name}
                                  </p>
                                  <p className='text-xs text-muted-foreground dark:text-text-white mt-0.5 transition-colors duration-300'>
                                    {permission.apiPath}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className='pl-2'>
                              <motion.div
                                initial={false}
                                animate={{ scale: isSelected ? 1 : 0.85 }}
                                transition={{
                                  type: 'spring',
                                  stiffness: 500,
                                  damping: 30,
                                }}
                              >
                                {isSelected ? (
                                  <CheckCircle2 className='h-5 w-5 text-primary dark:text-primary-400 transition-colors duration-300' />
                                ) : (
                                  <Circle className='h-5 w-5 text-muted-foreground/70 dark:text-text-white hover:text-muted-foreground dark:hover:text-white transition-colors duration-300' />
                                )}
                              </motion.div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>

            <DialogFooter className='pt-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                className='hover:bg-gray-100 dark:hover:bg-darker-2 transition-colors duration-300'
              >
                Hủy
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Đang gửi...' : 'Gửi'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
