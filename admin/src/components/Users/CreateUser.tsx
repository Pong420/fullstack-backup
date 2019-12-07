import React, { useCallback } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Button } from '@blueprintjs/core';
import { UserDialog } from './UserDialog';
import { createUser } from '../../services';
import { useUserActions } from '../../store';
import { useBoolean } from '../../hooks/useBoolean';
import { Schema$User } from '../../typings';

const createUserAPI = (...params: Parameters<typeof createUser>) =>
  createUser(...params).then(res => res.data.data);

const rid = (N = 5) => {
  const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.apply(null, Array(N))
    .map(() => s.charAt(Math.floor(Math.random() * s.length)))
    .join('');
};

export const CreateUser = React.memo(() => {
  const [dialogOpen, { on, off }] = useBoolean();
  const { addUser } = useUserActions();
  const onSuccess = useCallback(
    (user: Schema$User) => {
      addUser(user);
      off();
    },
    [addUser, off]
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
        initialValues={{
          username: rid(8),
          password: rid(8),
          email: `${rid(8)}@gmail.com`,
          nickname: rid(5).toUpperCase()
        }}
      />
    </>
  );
});
