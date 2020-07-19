import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  View
} from 'react-native';
import { flex, dimen } from '../../styles';
import { Logo } from '../../components/Logo';

export function Login() {
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <SafeAreaView style={dimen('100%')}>
        <ScrollView
          keyboardShouldPersistTaps="never"
          contentContainerStyle={{ width: '100%', flexGrow: 1 }}
        >
          <Logo style={{ marginTop: 50 }} />
          <View style={{ padding: 20, flex: 1 }}></View>
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
