import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { usePermissions } from '../context/permissions-context';
import { useLanguage } from '@/contexts/language-context';

export function PermissionsPrimaryButtons() {
  const { setOpen } = usePermissions();
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-x-2">
      <Button onClick={() => setOpen('add')} size="sm">
        <IconPlus className="mr-2 h-4 w-4" />
        {t('permissionAdd')}
      </Button>
    </div>
  );
}
