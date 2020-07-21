import React, { useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  View,
  Platform
} from 'react-native';
import { useRxAsync } from 'use-rx-hooks';
import { dimen } from '../../styles';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { toaster } from '../../components/Toast';
import { useBoolean } from '../../hooks/useBoolean';
import { useAuth } from '../../hooks/useAuth';
import { register } from '../../service';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

const onRegistrationFailure = toaster.apiError.bind(
  toaster,
  'Registration failure'
);

export function Login() {
  const [isLogin, backToLogin, , toggleRegister] = useBoolean(true);
  const { loginStatus, authorize } = useAuth();
  const onSuccess = useRef(() => {
    backToLogin();
    toaster.success({ message: 'Registration success' });
  });
  const registration = useRxAsync(register, {
    defer: true,
    onSuccess: onSuccess.current,
    onFailure: onRegistrationFailure
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
      <SafeAreaView style={{ ...dimen('100%'), backgroundColor: '#fff' }}>
        <ScrollView
          alwaysBounceVertical={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Logo size={90} style={{ marginVertical: 50 }} />

          <View style={{ padding: 20, flexGrow: 1 }}>
            {isLogin ? (
              <LoginForm
                loading={loginStatus === 'loading'}
                onSubmit={authorize}
              />
            ) : (
              <RegisterForm
                loading={registration.loading}
                onSubmit={registration.run}
              />
            )}
            <Button
              onPress={toggleRegister}
              style={{ marginTop: 15 }}
              title={isLogin ? 'Register' : 'Already have an account'}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
