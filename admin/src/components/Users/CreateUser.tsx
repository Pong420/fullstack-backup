import React from 'react';
import { Button } from '@blueprintjs/core';
import { UserDialog } from './UserDialog';
import { useBoolean } from '../../hooks/useBoolean';

export function CreateUser() {
  const [dialogOpen, setDialogOpen] = useBoolean();
  return (
    <>
      <Button minimal icon="new-person" onClick={setDialogOpen.on} />
      <UserDialog
        icon="new-person"
        title="Create User"
        className="create-user-dialog"
        isOpen={dialogOpen}
        onClose={setDialogOpen.off}
      />
    </>
  );
}
