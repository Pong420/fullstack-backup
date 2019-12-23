import React, { useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  View
} from 'react-native';
import { useSelector } from 'react-redux';
import { useBoolean } from '@fullstack/common/hooks/useBoolean';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { flex, dimen } from '../../styles';
import { useAuthActions, loginStatusSelector } from '../../store';

export function Login() {
  const [isLogin, , , toggle] = useBoolean(true);
  const { login, registration, refreshToken } = useAuthActions();
  const loginStatus = useSelector(loginStatusSelector);

  useEffect(() => {
    loginStatus === 'unknown' && refreshToken();
  }, [loginStatus, refreshToken]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <SafeAreaView style={{ ...dimen('100%') }}>
        <ScrollView
          keyboardShouldPersistTaps="never"
          contentContainerStyle={{ width: '100%', flexGrow: 1 }}
        >
          <Logo
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 50
            }}
          />
          <View style={{ padding: 20, flex: 1 }}>
            {isLogin ? (
              <LoginForm loading={loginStatus === 'loading'} onSubmit={login} />
            ) : (
              <RegisterForm
                loading={loginStatus === 'loading'}
                onSubmit={registration}
              />
            )}
            <Button
              ghost
              style={{ marginTop: 15 }}
              title={isLogin ? 'Register' : 'Already have an account'}
              onPress={toggle}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...flex({ alignItems: 'flex-start', justifyContent: 'center' }),
    backgroundColor: '#fff'
  }
});
