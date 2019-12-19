import React from 'react';
import { StyleSheet, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { LoginForm } from './LoginForm';
import { flex } from '../../styles';

export function Login() {
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <SafeAreaView style={{ width: '100%' }}>
        <LoginForm />
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
