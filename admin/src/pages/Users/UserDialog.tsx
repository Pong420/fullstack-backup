import React from 'react';
import { Intent } from '@blueprintjs/core';
import { AsyncFnDialog, AsyncFnDialogProps } from '../../components/Dialog';
import {
  UserForm,
  UserFormProps,
  useUserForm
} from '../../components/UserForm';

export interface UserDialogProps
  extends Omit<AsyncFnDialogProps, 'onConfirm'>,
    UserFormProps {
  id?: string;
}

export const UserDialog = React.memo(
  ({ id, initialValues, onSubmit, exclude, ...props }: UserDialogProps) => {
    const [form] = useUserForm();

    return (
      <AsyncFnDialog
        {...props}
        intent={Intent.PRIMARY}
        onConfirm={form.submit}
        onClosed={() => form.resetFields()}
      >
        <UserForm
          form={form}
          exclude={exclude}
          onSubmit={onSubmit}
          initialValues={initialValues}
        />
      </AsyncFnDialog>
    );
  }
);
