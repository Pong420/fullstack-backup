import React from 'react';
import { ButtonGroup } from '@blueprintjs/core';
import { ButtonPopover } from '../ButtonPopover';
import { Schema$User } from '../../typings';
import { useBoolean } from '../../hooks/useBoolean';
import { UserDialog } from './UserDialog';

interface Props extends Schema$User {}

function EditUser(props: Schema$User) {
  const [dialogOpen, setDialogOpen] = useBoolean();
  return (
    <>
      <ButtonPopover icon="edit" content="Edit" onClick={setDialogOpen.on} />
      <UserDialog
        icon="edit"
        title="Edit User"
        isOpen={dialogOpen}
        initialValues={props}
        onClose={setDialogOpen.off}
      />
    </>
  );
}

export function UserControls(props: Props) {
  return (
    <ButtonGroup>
      <ButtonPopover icon="info-sign" content="More info" />
      <EditUser {...props} />
      <ButtonPopover icon="trash" content="Remove" />
    </ButtonGroup>
  );
}
