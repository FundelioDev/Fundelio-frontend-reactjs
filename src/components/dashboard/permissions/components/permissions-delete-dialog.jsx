import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { usePermissions } from '../context/permissions-context';
import { permissionsApi } from '@/api/permissionApi';

export function PermissionsDeleteDialog({ open, onOpenChange, type, data }) {
  const { refetch } = usePermissions();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      let response;
      if (type === 'module') {
        // Xóa module - truyền name của module
        response = await permissionsApi.deleteModule(data.name);
      } else {
        // Xóa permission - truyền permissionId
        response = await permissionsApi.deletePermission(data.permissionId);
      }

      if (response?.data?.success) {
        const successMessage =
          type === 'module'
            ? response?.data?.message || 'Xóa module thành công'
            : response?.data?.message || 'Xóa permission thành công';
        toast.success(successMessage);
        refetch();
        onOpenChange(false);
      } else {
        const errorMessage =
          type === 'module'
            ? response?.data?.message || 'Không thể xóa module'
            : response?.data?.message || 'Không thể xóa permission';
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        (type === 'module'
          ? 'Không thể xóa module'
          : 'Không thể xóa permission');
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='bg-white dark:bg-darker-2 border-border transition-colors duration-300'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-text-primary dark:text-white transition-colors duration-300'>
            Xác nhận xóa
          </AlertDialogTitle>
          <AlertDialogDescription className='text-muted-foreground dark:text-text-white transition-colors duration-300'>
            {type === 'module'
              ? `Bạn có chắc chắn muốn xóa module "${data.name}" không?`
              : 'Bạn có chắc chắn muốn xóa permission này không?'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='hover:bg-gray-100 dark:hover:bg-darker-2 transition-colors duration-300'>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-red-600 dark:hover:bg-red-700 transition-colors duration-300'
          >
            {isDeleting ? 'Đang xóa...' : 'Xóa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
