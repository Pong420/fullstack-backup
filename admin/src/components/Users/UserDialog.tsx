import React from 'react';
import { useForm } from 'rc-field-form';
import { Intent } from '@blueprintjs/core';
import { AsyncFnDialog, AsyncFnDialogProps } from '../Dialog';
import { UserForm, UserFormProps } from '../UserForm';

export interface UserDialogProps
  extends Omit<AsyncFnDialogProps, 'onConfirm'>,
    UserFormProps {
  id?: string;
}

export const UserDialog = React.memo(
  ({ id, initialValues, onSubmit, exclude, ...props }: UserDialogProps) => {
    const [form] = useForm();

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
