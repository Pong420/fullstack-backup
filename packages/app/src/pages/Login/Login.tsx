import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  View,
  Platform
} from 'react-native';
import { dimen, marginY } from '../../styles';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { useBoolean } from '../../hooks/useBoolean';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function Login() {
  const [isLogin, , , toggleRegister] = useBoolean(true);
  const { authorize } = useAuth();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
      <SafeAreaView style={dimen('100%')}>
        <ScrollView
          alwaysBounceVertical={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Logo size={90} style={marginY(50)} />

          <View style={{ padding: 20, flexGrow: 1 }}>
            {isLogin ? <LoginForm onSubmit={authorize} /> : <RegisterForm />}
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
