import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'rc-field-form';
import { useRxAsync } from 'use-rx-hooks';
import { Card, InputGroup, H4, Divider, Button } from '@blueprintjs/core';
import { Layout } from '../../components/Layout';
import { Avatar } from '../../components/Avatar';
import { EditAvatar, OnAvatarChange } from './EditAvatar';
import { Param$UpdateUser, Schema$User } from '../../typings';
import { authUserSelector, useAuthActions } from '../../store';
import { updateUser } from '../../services';
import { createForm } from '../../utils/form';
import { Toaster } from '../../utils/toaster';

const { Form, FormItem } = createForm<Param$UpdateUser>();

const SectionTitle = React.memo(({ children }) => (
  <>
    <H4 className="section-title" children={children} />
    <Divider />
  </>
));

export function Settings() {
  const [form] = useForm();

  const { setFieldsValue } = form;
  const { id, nickname, email, username, avatar } = useSelector(
    authUserSelector
  )!;

  const [localAvatar, setLocalAvatar] = useState(avatar);

  const request = useCallback(
    (params: Partial<Param$UpdateUser>) =>
      updateUser({ id, ...params }).then(res => res.data.data),
    [id]
  );

  const { updateAuthUser } = useAuthActions();

  const onAvatarChange = useCallback<OnAvatarChange>(
    changes => {
      console.log(avatar, changes);
      setFieldsValue({
        avatar: changes
          ? changes.file
          : avatar === changes
          ? undefined
          : changes
      });
      setLocalAvatar(changes && changes.url);
    },
    [avatar, setFieldsValue]
  );

  const onSuccess = useCallback(
    (user: Partial<Schema$User>) => {
      Toaster.success({ message: 'Profile Updated' });
      updateAuthUser(user);
    },
    [updateAuthUser]
  );

  const { loading, run } = useRxAsync(request, {
    defer: true,
    onSuccess
  });

  return (
    <Layout className="settings" icon="cog" title="Settings">
      <Card>
        <div className="section">
          <SectionTitle>Profile</SectionTitle>
          <Form
            className="section-content"
            form={form}
            onReset={() => updateAuthUser({ avatar: null })}
            onFinish={({ avatar, ...store }) =>
              run({
                ...(typeof avatar !== 'undefined' ? { avatar } : {}),
                ...store
              })
            }
            initialValues={{ id, nickname, email, avatar: undefined }}
          >
            <div className="section-group">
              <div className="section-group-left">
                <FormItem label="Nickname" name="nickname">
                  <InputGroup />
                </FormItem>
                <FormItem label="Email" name="email">
                  <InputGroup />
                </FormItem>
              </div>
              <div className="section-group-right">
                <FormItem name="avatar" noStyle>
                  <Avatar size={150} avatar={localAvatar} fallback={username}>
                    <EditAvatar
                      avatar={localAvatar}
                      onChange={onAvatarChange}
                    />
                  </Avatar>
                </FormItem>
              </div>
            </div>
            <Divider />
            <div className="buttons">
              <Button
                disabled={loading}
                onClick={() => {
                  form.resetFields();
                  setLocalAvatar(avatar);
                }}
              >
                Reset
              </Button>
              <Button type="submit" loading={loading}>
                Apply
              </Button>
            </div>
          </Form>
        </div>
      </Card>
    </Layout>
  );
}
