import React, { useCallback } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { ButtonPopover } from '../ButtonPopover';
import { UserDialog, UserDialogProps } from './UserDialog';
import { useUserActions, authUserSelector } from '../../store';
import { Schema$User, Param$UpdateUser } from '../../typings';
import {
  updateUser as updateUserAPI,
  deleteUser as deleteUserAPI
} from '../../services';
import { useBoolean } from '../../hooks/useBoolean';
import { useSelector } from 'react-redux';
import { AsyncFnDialog } from '../Dialog';

interface Props extends Partial<Schema$User> {}

const exclude: UserDialogProps['exclude'] = ['username'];

const EditUser = React.memo(({ id = '', ...props }: Partial<Schema$User>) => {
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
      <ButtonPopover
        icon="edit"
        content="Edit"
        onClick={on}
        disabled={id === ''}
      />
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

const RemoveUser = React.memo(({ id = '', ...props }: Partial<Schema$User>) => {
  const [dialogOpen, { on, off }] = useBoolean();
  const { removeUser } = useUserActions();
  const request = useCallback(async () => {
    await deleteUserAPI({ id });
    removeUser({ id });
    off();
  }, [id, off, removeUser]);

  const { run, loading } = useRxAsync(request, { defer: true });

  return (
    <>
      <ButtonPopover
        icon="trash"
        content="Remove"
        onClick={on}
        disabled={id === ''}
      />
      <AsyncFnDialog
        icon="trash"
        title="Remove User"
        intent="danger"
        isOpen={dialogOpen}
        loading={loading}
        onConfirm={run}
        onClose={off}
      >
        Are you sure to delete <b>{props.nickname}</b>'s account? This action is
        irreversible
      </AsyncFnDialog>
    </>
  );
});

export function UserControls(props: Props) {
  const user = useSelector(authUserSelector)!;
  const disabled = user.role === props.role;

  if (disabled) {
    return <div />;
  }

  return (
    <div>
      <EditUser {...props} />
      <RemoveUser {...props} />
    </div>
  );
}
