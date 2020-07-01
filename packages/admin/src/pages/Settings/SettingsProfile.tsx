import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRxAsync } from 'use-rx-hooks';
import { Divider, Button } from '@blueprintjs/core';
import { Schema$User } from '@fullstack/typings';
import { defer } from 'rxjs';
import { shareReplay, switchMap, map } from 'rxjs/operators';
import { SettingsSection } from './SettingsSection';
import { UpdateAvatar } from './UpdateAvatar';
import { createUserForm } from '../../components/UserForm';
import { authUserSelector, useAuthActions } from '../../store';
import { getUserProfile, getJwtToken, updateUser } from '../../service';
import { Toaster } from '../../utils/toaster';

const { UserForm, FormItem, Nickname, Email, useForm } = createUserForm();

const getProfile$ = defer(() => getJwtToken()).pipe(
  switchMap(({ user }) =>
    defer(() => getUserProfile({ id: user.user_id })).pipe(
      map(response => response.data.data)
    )
  ),
  shareReplay(1)
);

const getProfileFailure = Toaster.apiError.bind(Toaster, 'Get profile failure');
const updateProfileFailure = Toaster.apiError.bind(
  Toaster,
  'Update profile failure'
);

const updateUserReq = (...args: Parameters<typeof updateUser>) =>
  updateUser(...args).then(res => res.data.data);

export function SettingsProfile() {
  const user: Partial<Schema$User> = useSelector(authUserSelector) || {};
  const { id, username, ...initialValues } = user;
  const { profileUpdate } = useAuthActions();
  const [form] = useForm();

  const { getProfile, updateProfileSuccess } = useMemo(() => {
    return {
      getProfile: () => getProfile$,
      updateProfileSuccess: (user: Schema$User) => {
        profileUpdate(user);
        Toaster.success({ message: 'Update profile success' });
      }
    };
  }, [profileUpdate]);

  useRxAsync(getProfile, {
    onSuccess: profileUpdate,
    onFailure: getProfileFailure
  });

  const { run, loading } = useRxAsync(updateUserReq, {
    defer: true,
    onSuccess: updateProfileSuccess,
    onFailure: updateProfileFailure
  });

  return (
    <SettingsSection title="Profile" className="settings-profile">
      <UserForm
        key={id} // for update initialValues
        form={form}
        initialValues={initialValues} // for rest
        onFinish={payload => id && run({ id, ...payload })}
      >
        <div className="form-content">
          <div className="left">
            <Nickname />
            <Email />
          </div>
          <div className="right">
            <FormItem name="avatar">
              <UpdateAvatar fallback={username} />
            </FormItem>
          </div>
        </div>
        <Divider />
        <div className="form-footer">
          <Button disabled={loading} onClick={() => form.resetFields()}>
            Reset
          </Button>
          <Button loading={loading} onClick={form.submit}>
            Apply
          </Button>
        </div>
      </UserForm>
    </SettingsSection>
  );
}
