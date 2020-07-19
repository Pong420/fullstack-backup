import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  View,
  Platform
} from 'react-native';
import { dimen } from '../../styles';
import { Logo } from '../../components/Logo';
import { LoginForm } from './LoginForm';

export function Login() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
      <SafeAreaView style={dimen('100%')}>
        <ScrollView
          keyboardShouldPersistTaps="never"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={{ padding: 20, flexGrow: 1, justifyContent: 'center' }}>
            <Logo size={90} />
          </View>
          <View style={{ padding: 20, flexGrow: 1 }}>
            <LoginForm />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
