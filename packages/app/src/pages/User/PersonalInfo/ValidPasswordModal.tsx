import React, { useRef } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { StackScreenProps } from '@react-navigation/stack';
import { Param$Login, Schema$User } from '@fullstack/typings';
import {
  ValidPasswordContent,
  useForm
} from '../../../components/ValidPassword';
import { toaster } from '../../../components/Toast';
import { Paths } from '../constants';
import { login, getUserProfile } from '../../../service';
import { useAuth } from '../../../hooks/useAuth';

const request = (params: Param$Login) =>
  login(params).then(res =>
    getUserProfile({ id: res.data.data.user.user_id }).then(
      res => res.data.data
    )
  );

const onFailure = toaster.apiError.bind(toaster, 'Validation failure');

export function ValidPasswordModal({
  navigation
}: StackScreenProps<Record<string, undefined>>) {
  const { updateProfile } = useAuth();
  const { current: onSuccess } = useRef((payload: Schema$User) => {
    updateProfile(payload);
    navigation.navigate(Paths.PeronsalInfo);
  });
  const [form] = useForm();
  const { run, loading } = useRxAsync(request, {
    defer: true,
    onSuccess,
    onFailure
  });

  return <ValidPasswordContent form={form} loading={loading} onFinish={run} />;
}
