import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { useRoles } from '../context/roles-context';

export function RolesDeleteDialog({ open, onOpenChange }) {
  const [value, setValue] = useState('');
  const { currentRow, deleteRole } = useRoles();

  if (!currentRow) return null;

  const handleDelete = async () => {
    if (value.trim() !== currentRow.name) return;

    try {
      await deleteRole(currentRow.roleId);
      toast({
        title: 'Thành công',
        description: `Xóa vai trò ${currentRow.name} thành công`,
      });
      onOpenChange(false);
      setValue(''); // Reset input after successful deletion
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description:
          error instanceof Error ? error.message : 'Không thể xóa vai trò',
      });
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) setValue(''); // Reset input when dialog closes
      }}
      title="Xác nhận xóa"
      desc={`Bạn có chắc chắn muốn xóa vai trò "${currentRow.name}"? Hành động này không thể hoàn tác.`}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name}
      className="gap-6"
    >
      <div className="space-y-4">
        <Label className="space-y-2">
          <span>
            Nhập tên vai trò "{currentRow.name}" để xác nhận xóa
          </span>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Nhập tên vai trò"
          />
        </Label>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Cảnh báo</AlertTitle>
          <AlertDescription>Hành động này sẽ xóa vĩnh viễn vai trò và không thể hoàn tác.</AlertDescription>
        </Alert>
      </div>
    </ConfirmDialog>
  );
}

