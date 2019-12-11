import React, { useCallback } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Button } from '@blueprintjs/core';
import { UserDialog, UserDialogProps } from './UserDialog';
import { createUser } from '../../services';
import { useUserActions } from '../../store';
import { Schema$User } from '../../typings';
import { useBoolean } from '../../hooks/useBoolean';
import { validators } from '../../utils/form';

const createUserAPI = (...params: Parameters<typeof createUser>) =>
  createUser(...params).then(res => res.data.data);

const passwordValidators: UserDialogProps['passwordValidators'] = [
  validators.password()
];

export const CreateUser = React.memo(() => {
  const [dialogOpen, { on, off }] = useBoolean();
  const { createUser } = useUserActions();
  const onSuccess = useCallback(
    (user: Schema$User) => {
      createUser(user);
      off();
    },
    [createUser, off]
  );
  const { run, loading } = useRxAsync(createUserAPI, {
    defer: true,
    onSuccess
  });

  return (
    <>
      <Button minimal icon="new-person" onClick={on} />
      <UserDialog
        icon="new-person"
        title="Create User"
        className="create-user-dialog"
        isOpen={dialogOpen}
        loading={loading}
        onSubmit={run}
        onClose={off}
        passwordValidators={passwordValidators}
      />
    </>
  );
});
