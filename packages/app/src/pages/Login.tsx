import React from 'react';
import { StyleSheet, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { TextInput } from '../components/TextInput';
import { flex } from '../styles';

export function Login() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ width: '100%', padding: 15 }}
        behavior="padding"
        enabled
      >
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1
          }}
        />
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...flex({ alignItems: 'center', justifyContent: 'center' }),
    backgroundColor: '#fff'
  }
});
