import React, { useCallback } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { ButtonPopover } from '../../components/ButtonPopover';
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
const title = 'Create User';

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
      <ButtonPopover minimal icon="new-person" content={title} onClick={on} />
      <UserDialog
        icon="new-person"
        className="create-user-dialog"
        title={title}
        isOpen={dialogOpen}
        loading={loading}
        onSubmit={run}
        onClose={off}
        passwordValidators={passwordValidators}
      />
    </>
  );
});
