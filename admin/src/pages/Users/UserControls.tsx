import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRxAsync } from 'use-rx-hooks';
import { ButtonPopover } from '../../components/ButtonPopover';
import { AsyncFnDialog } from '../../components/Dialog';
import { UserDialog, UserDialogProps } from './UserDialog';
import { useUserActions, authUserSelector } from '../../store';
import { Schema$User, Param$UpdateUser } from '../../typings';
import {
  updateUser as updateUserAPI,
  deleteUser as deleteUserAPI
} from '../../services';
import { useBoolean } from '../../hooks/useBoolean';
import { validators } from '../../utils/form';

interface Props extends Partial<Schema$User> {}

const exclude: UserDialogProps['exclude'] = ['username', 'confirmPassword'];
const passwordValidators: UserDialogProps['passwordValidators'] = [
  (rule: any, value: string) =>
    !value.trim()
      ? Promise.resolve()
      : validators.password({ required: false })(rule, value)
];

const EditUser = React.memo(
  ({ id = '', avatar, ...props }: Partial<Schema$User>) => {
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
          passwordValidators={passwordValidators}
        />
      </>
    );
  }
);

const DeleteUser = React.memo(({ id = '', ...props }: Partial<Schema$User>) => {
  const [dialogOpen, { on, off }] = useBoolean();
  const { deleteUser } = useUserActions();
  const request = useCallback(async () => {
    await deleteUserAPI({ id });
    deleteUser({ id });
    off();
  }, [id, off, deleteUser]);

  const { run, loading } = useRxAsync(request, { defer: true });

  return (
    <>
      <ButtonPopover
        icon="trash"
        content="Delete"
        onClick={on}
        disabled={id === ''}
      />
      <AsyncFnDialog
        icon="trash"
        title="Delete User"
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
      <DeleteUser {...props} />
    </div>
  );
}