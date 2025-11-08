import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePermissions } from '../context/permissions-context';

export function PermissionsPrimaryButtons() {
  const { setOpen } = usePermissions();

  return (
    <div className="flex items-center gap-x-2">
      <Button onClick={() => setOpen('add')} size="sm">
        <Plus className="mr-2 h-4 w-4" />
        Thêm Permission
      </Button>
    </div>
  );
}

