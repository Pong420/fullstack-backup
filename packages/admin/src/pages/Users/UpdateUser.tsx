import React, { useRef, useEffect } from 'react';
import { Schema$User, Param$User } from '@fullstack/typings';
import { openConfirmDialog } from '../../components/ConfirmDialog';
import { ButtonPopover, IconName } from '../../components/ButtonPopover';
import { createUserForm, UserFormInstance } from '../../components/UserForm';
import { Toaster } from '../../utils/toaster';
import { updateUser } from '../../service';

export interface OnUpdate {
  onUpdate: (payload: Param$User & Partial<Schema$User>) => void;
}

interface UpdateUserProps extends OnUpdate, Partial<Schema$User> {
  id: string;
}

const onFailure = Toaster.apiError.bind(Toaster, 'Update user failure');

const { Form, Nickname, Email, UserRole, useForm } = createUserForm();

function UpdateUserForm({
  form,
  ...user
}: { form: UserFormInstance } & Partial<Schema$User>) {
  const { setFieldsValue } = form;
  const persists = useRef(user);

  useEffect(() => {
    setFieldsValue(persists.current);
  }, [setFieldsValue]);

  return (
    <Form form={form}>
      <Nickname />
      <Email />
      <UserRole />
    </Form>
  );
}

const icon: IconName = 'edit';
const title = 'Update User';
export function UpdateUser({ id, onUpdate, ...user }: UpdateUserProps) {
  const [form] = useForm();

  async function onConfirm() {
    const payload = await form.validateFields();
    const response = await updateUser({ ...payload, id });
    onUpdate(response.data.data);
  }

  return (
    <ButtonPopover
      icon={icon}
      content={title}
      onClick={() =>
        openConfirmDialog({
          icon,
          title,
          onFailure,
          onConfirm,
          children: <UpdateUserForm form={form} {...user} />
        })
      }
    />
  );
}
