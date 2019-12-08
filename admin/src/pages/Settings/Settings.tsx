import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'rc-field-form';
import { useRxAsync } from 'use-rx-hooks';
import { Card, InputGroup, H4, Divider, Button } from '@blueprintjs/core';
import { Layout } from '../../components/Layout';
import { Avatar } from '../../components/Avatar';
import { createForm } from '../../utils/form';
import { Param$UpdateUser, Schema$User } from '../../typings';
import { authUserSelector, useAuthActions } from '../../store';
import { updateUser } from '../../services';
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

  const { id, nickname, email, username, avatar } = useSelector(
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
            onFinish={run}
            initialValues={{ id, nickname, email, avatar }}
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
                <Avatar size={150} avatar={avatar} fallback={username}>
                  <Button small icon="edit" minimal>
                    Edit
                  </Button>
                </Avatar>
              </div>
            </div>
            <Divider />
            <div className="buttons">
              <Button onClick={() => form.resetFields()} disabled={loading}>
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
