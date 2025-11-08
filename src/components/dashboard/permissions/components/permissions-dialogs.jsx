import { usePermissions } from '../context/permissions-context';
import { PermissionsFormDialog } from './permissions-form-dialog';
import { PermissionsDeleteDialog } from './permissions-delete-dialog';

export function PermissionsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePermissions();

  const handleOpenChange = (dialogType) => {
    setOpen(dialogType);
    if (!['edit', 'delete'].includes(dialogType)) {
      setTimeout(() => {
        setCurrentRow(null);
      }, 500);
    }
  };

  return (
    <>
      <PermissionsFormDialog
        key={
          currentRow
            ? `permission-${currentRow.permissionId}`
            : 'permission-add'
        }
        open={open === 'add' || open === 'edit'}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpen(null);
            setTimeout(() => {
              setCurrentRow(null);
            }, 500);
          }
        }}
        currentRow={currentRow}
      />

      {currentRow && (
        <PermissionsDeleteDialog
          key={`permission-delete-${currentRow.permissionId}`}
          open={open === 'delete'}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setOpen(null);
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }
          }}
          type="permission"
          data={{
            permissionId: currentRow.permissionId,
            name: currentRow.name,
            module: currentRow.module,
          }}
        />
      )}
    </>
  );
}

