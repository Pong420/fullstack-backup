import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRxAsync, RxFileToImageState } from 'use-rx-hooks';
import { InputGroup, Divider, Button } from '@blueprintjs/core';
import { createForm, validators } from '@fullstack/common/utils/form';
import { Avatar } from '../../components/Avatar';
import { SettingsSection } from './SettingsSection';
import { EditAvatar } from './EditAvatar';
import { Param$UpdateUser, Schema$User } from '../../typings';
import { authUserSelector, useAuthActions } from '../../store';
import { updateUser } from '../../service';
import { Toaster } from '../../utils/toaster';

interface Field extends Omit<Param$UpdateUser, 'avatar'> {
  avatar?: RxFileToImageState | string | null;
}

const { Form, FormItem, useForm } = createForm<Field>();

export function SettingsProfile() {
  const [form] = useForm();
  const { resetFields } = form;

  const { id, nickname, email, username, avatar: oldAvatar } = useSelector(
    authUserSelector
  )!;

  const request = useCallback(
    (params: Partial<Param$UpdateUser>) =>
      updateUser({ id, ...params }).then(res => res.data.data),
    [id]
  );

  const { updateAuthUser } = useAuthActions();

  const onSuccess = useCallback(
    (user: Partial<Schema$User>) => {
      Toaster.success({ message: 'Profile Updated' });
      updateAuthUser(user);
      resetFields(); // mainly for update avatar value
    },
    [updateAuthUser, resetFields]
  );

  const { loading, run } = useRxAsync(request, {
    defer: true,
    onSuccess
  });

  return (
    <SettingsSection title="Profile" className="settings-profile">
      <Form
        form={form}
        initialValues={{ id, nickname, email, avatar: oldAvatar }}
        onFinish={({ avatar, ...store }) => {
          run({
            ...(oldAvatar !== avatar && {
              oldAvatar,
              avatar: typeof avatar === 'object' ? avatar && avatar.file : null
            }),
            ...store
          });
        }}
      >
        <div className="group">
          <div className="group-left">
            <FormItem label="Nickname" name="nickname">
              <InputGroup />
            </FormItem>

            <FormItem
              name="email"
              label="Email"
              validators={[
                validators.required('Please input an email'),
                validators.isEmail
              ]}
            >
              <InputGroup />
            </FormItem>
          </div>

          <div className="group-right">
            <FormItem
              noStyle
              name="avatar"
              deps={['avatar']}
              valuePropName="value"
            >
              {({ avatar }) => (
                <EditAvatar>
                  <Avatar
                    size={150}
                    avatar={
                      avatar &&
                      (typeof avatar === 'string' ? avatar : avatar.url)
                    }
                    fallback={username}
                  />
                </EditAvatar>
              )}
            </FormItem>
          </div>
        </div>

        <Divider />

        <div className="buttons">
          <Button disabled={loading} onClick={() => resetFields()}>
            Reset
          </Button>
          <Button type="submit" loading={loading}>
            Apply
          </Button>
        </div>
      </Form>
    </SettingsSection>
  );
}
