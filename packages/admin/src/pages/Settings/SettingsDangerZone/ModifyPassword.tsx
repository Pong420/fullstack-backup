import React from 'react';
import { Param$ModifyPassword } from '@fullstack/typings';
import { Password } from '../../../components/Input';
import { DangerButton } from '../../../components/DangerButton';
import { openConfirmDialog } from '../../../components/ConfirmDialog';
import { createForm, FormProps, validators } from '../../../utils/form';
import { Toaster } from '../../../utils/toaster';
import { modifyPassword } from '../../../service';
import { userValidaors } from '../../../components/UserForm';
import { useAuthActions } from '../../../store';

const { Form, FormItem, useForm } = createForm<Param$ModifyPassword>();

function ModifyPasswordForm(props: FormProps<Param$ModifyPassword>) {
  return (
    <Form {...props}>
      <FormItem
        name="password"
        label="Old Passwrod"
        validators={[validators.required('Please input your old password')]}
      >
        <Password />
      </FormItem>

      <FormItem
        name="newPassword"
        label="New Passwrod"
        deps={['password']}
        validators={({ password }) => {
          return [
            validators.required('Please input new password'),
            userValidaors.password.format,
            validators.shouldNotBeEqual(
              password,
              'The new password should not be equal to the old password'
            )
          ];
        }}
      >
        <Password />
      </FormItem>

      <FormItem
        name="confirmNewPassword"
        label="Confirm New Password"
        deps={['newPassword']}
        validators={({ newPassword }) => [
          validators.required('Please input the new password again'),
          validators.shouldBeEqual(
            newPassword,
            'Confirm new password is not equal to the above new password'
          )
        ]}
      >
        <Password />
      </FormItem>
    </Form>
  );
}

const title = 'Modify Password';
export function ModifyPassword() {
  const [form] = useForm();
  const { logout } = useAuthActions();
  return (
    <DangerButton
      text={title}
      onClick={() =>
        openConfirmDialog({
          title,
          icon: 'lock',
          intent: 'danger',
          children: <ModifyPasswordForm form={form} />,
          onClosed: () => form.resetFields(),
          onConfirm: () =>
            form.validateFields().then(payload =>
              modifyPassword(payload)
                .then(() => {
                  Toaster.success({ message: 'Modify password success' });
                  logout();
                })
                .catch(error =>
                  Toaster.apiError('Modify password failure', error)
                )
            )
        })
      }
    />
  );
}
