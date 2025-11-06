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
import { permissionsApi } from '@/api-client';
import { useLanguage } from '@/contexts/language-context';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'module' | 'permission';
  data: {
    permissionId?: string;
    name: string;
    module?: string;
  };
}

export function PermissionsDeleteDialog({
  open,
  onOpenChange,
  type,
  data,
}: Props) {
  const { refetch } = usePermissions();
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useLanguage();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await permissionsApi.deletePermission(data.permissionId!);
      toast.success(t('permissionDeleteSuccess'));
      refetch();
      onOpenChange(false);
    } catch (error) {
      toast.error(t('permissionDeleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('permissionConfirmDelete')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('permissionDeleteDesc')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? t('permissionDeleting') : t('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
