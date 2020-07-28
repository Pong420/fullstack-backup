import React, { useRef } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Param$Login, Schema$User } from '@fullstack/typings';
import {
  ValidPasswordContent,
  useForm
} from '../../../components/ValidPassword';
import { toaster } from '../../../components/Toast';
import { login, getUserProfile } from '../../../service';
import { useAuth } from '../../../hooks/useAuth';
import { PersonalInfoScreenProps } from './routes';

const request = (params: Param$Login) =>
  login(params).then(res =>
    getUserProfile({ id: res.data.data.user.user_id }).then(
      res => res.data.data
    )
  );

const onFailure = toaster.apiError.bind(toaster, 'Validation failure');

export function ValidPasswordModal({
  navigation
}: PersonalInfoScreenProps<'ValidatePassword'>) {
  const { updateProfile } = useAuth();
  const { current: onSuccess } = useRef((user: Schema$User) => {
    updateProfile(user);
    navigation.navigate('Main', { user });
  });

  const { run, loading } = useRxAsync(request, {
    defer: true,
    onSuccess,
    onFailure
  });

  const [form] = useForm();

  return <ValidPasswordContent form={form} loading={loading} onFinish={run} />;
}
