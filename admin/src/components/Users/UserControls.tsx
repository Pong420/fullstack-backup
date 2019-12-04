import React, { useCallback } from 'react';
import { ButtonGroup } from '@blueprintjs/core';
import { ButtonPopover } from '../ButtonPopover';
import { Schema$User, Param$UpdateUser } from '../../typings';
import { updateUser } from '../../store';
import { updateUser as updateUserAPI } from '../../services';
import { useBoolean } from '../../hooks/useBoolean';
import { UserDialog } from './UserDialog';

interface Props extends Schema$User {}

const EditUser = React.memo(({ id, ...props }: Schema$User) => {
  const [dialogOpen, setDialogOpen] = useBoolean();
  const request = useCallback(
    (param: Omit<Param$UpdateUser, 'id'>) => updateUserAPI({ id, ...param }),
    [id]
  );
  return (
    <>
      <ButtonPopover icon="edit" content="Edit" onClick={setDialogOpen.on} />
      <UserDialog
        icon="edit"
        title="Edit User"
        action={updateUser}
        isOpen={dialogOpen}
        initialValues={props}
        onClose={setDialogOpen.off}
        apiRequest={request}
      />
    </>
  );
});

export function UserControls(props: Props) {
  return (
    <ButtonGroup>
      <ButtonPopover icon="info-sign" content="More info" />
      <EditUser {...props} />
      <ButtonPopover icon="trash" content="Remove" />
    </ButtonGroup>
  );
}
