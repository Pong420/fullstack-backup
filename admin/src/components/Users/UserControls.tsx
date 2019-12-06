import React, { useCallback } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { ButtonGroup } from '@blueprintjs/core';
import { ButtonPopover } from '../ButtonPopover';
import { UserDialog, UserDialogProps } from './UserDialog';
import { useUserActions } from '../../store';
import { Schema$User, Param$UpdateUser } from '../../typings';
import { updateUser as updateUserAPI } from '../../services';
import { useBoolean } from '../../hooks/useBoolean';

interface Props extends Schema$User {}

const exclude: UserDialogProps['exclude'] = ['username'];

const EditUser = React.memo(({ id, ...props }: Schema$User) => {
  const [dialogOpen, { on, off }] = useBoolean();
  const { updateUser } = useUserActions();
  const request = useCallback(
    async (param: Omit<Param$UpdateUser, 'id'>) => {
      const res = await updateUserAPI({ id, ...param });
      updateUser(res.data.data);
      off();
    },
    [id, updateUser, off]
  );

  const { run, loading } = useRxAsync(request, { defer: true });

  return (
    <>
      <ButtonPopover icon="edit" content="Edit" onClick={on} />
      <UserDialog
        icon="edit"
        title="Edit User"
        exclude={exclude}
        isOpen={dialogOpen}
        initialValues={props}
        loading={loading}
        onSubmit={run}
        onClose={off}
      />
    </>
  );
});

export function UserControls(props: Props) {
  return (
    <ButtonGroup>
      <EditUser {...props} />
      <ButtonPopover icon="trash" content="Remove" />
    </ButtonGroup>
  );
}
