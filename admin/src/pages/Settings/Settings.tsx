import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'rc-field-form';
import { useRxAsync, RxFileToImageState } from 'use-rx-hooks';
import { Card, InputGroup, H4, Divider, Button } from '@blueprintjs/core';
import { Layout } from '../../components/Layout';
import { Avatar } from '../../components/Avatar';
import { EditAvatar } from './EditAvatar';
import { Param$UpdateUser, Schema$User } from '../../typings';
import { authUserSelector, useAuthActions } from '../../store';
import { updateUser } from '../../services';
import { createForm } from '../../utils/form';
import { Toaster } from '../../utils/toaster';

interface Field extends Omit<Param$UpdateUser, 'avatar'> {
  avatar?: RxFileToImageState | string | null;
}

const { Form, FormItem } = createForm<Field>();

const SectionTitle = React.memo(({ children }) => (
  <>
    <H4 className="section-title" children={children} />
    <Divider />
  </>
));

export function Settings() {
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
    <Layout className="settings" icon="cog" title="Settings">
      <Card>
        <div className="section">
          <SectionTitle>Profile</SectionTitle>
          <Form
            className="section-content"
            form={form}
            initialValues={{ id, nickname, email, avatar: oldAvatar }}
            onFinish={({ avatar, ...store }) => {
              run({
                ...(oldAvatar !== avatar && {
                  oldAvatar,
                  avatar:
                    typeof avatar === 'object' ? avatar && avatar.file : null
                }),
                ...store
              });
            }}
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
                <FormItem deps={['avatar']} noStyle>
                  {({ avatar }) => (
                    <FormItem name="avatar" valuePropName="value" noStyle>
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
                    </FormItem>
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
        </div>
      </Card>
    </Layout>
  );
}
