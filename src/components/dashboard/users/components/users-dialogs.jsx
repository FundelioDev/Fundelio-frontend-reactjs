'use client';

import { useUsers } from '../context/users-context';
import { UsersActionDialog } from './users-action-dialog';
import { UsersDeleteDialog } from './users-delete-dialog';
import { UsersInviteDialog } from './users-invite-dialog';
import { UsersViewDialog } from './users-view-dialog';

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers();

  return (
    <>
      <UsersActionDialog
        key='user-add'
        open={open === 'add'}
        onOpenChange={(state) => {
          if (!state) setOpen(null);
        }}
      />

      <UsersInviteDialog
        key='user-invite'
        open={open === 'invite'}
        onOpenChange={(state) => {
          if (!state) setOpen(null);
        }}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`user-edit-${currentRow.userId}`}
            open={open === 'edit'}
            onOpenChange={(state) => {
              if (!state) {
                setOpen(null);
                setCurrentRow(null);
              }
            }}
            currentRow={currentRow}
          />

          <UsersViewDialog
            key={`user-view-${currentRow.userId}`}
            open={open === 'view'}
            onOpenChange={(state) => {
              if (!state) {
                setOpen(null);
                setCurrentRow(null);
              }
            }}
            currentRow={currentRow}
          />

          <UsersDeleteDialog
            key={`user-delete-${currentRow.userId}`}
            open={open === 'delete'}
            onOpenChange={(state) => {
              if (!state) {
                setOpen(null);
                setCurrentRow(null);
              }
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}

