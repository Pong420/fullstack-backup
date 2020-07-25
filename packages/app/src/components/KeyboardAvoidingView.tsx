import React from 'react';
import {
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView as DefaultKeyboardAvoidingView
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export function KeyboardAvoidingView({ children }: Props) {
  const headerHeight = useHeaderHeight();

  return (
    <DefaultKeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >
        {children}
      </ScrollView>
    </DefaultKeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
