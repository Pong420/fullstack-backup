import React from 'react';
import {
  StyleSheet,
  Platform,
  ScrollView as DefaultScrollView,
  KeyboardAvoidingView as DefaultKeyboardAvoidingView,
  ScrollViewProps,
  KeyboardAvoidingViewProps
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import { ReactNode } from 'react';

interface ChildProps {
  children?: ReactNode;
}

export function ScrollView({
  contentContainerStyle,
  ...props
}: ScrollViewProps & ChildProps) {
  return (
    <DefaultScrollView
      {...props}
      bounces={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={StyleSheet.compose(
        contentContainerStyle,
        styles.scrollViewContent
      )}
    />
  );
}

export function KeyboardAvoidingView({
  style,
  ...props
}: KeyboardAvoidingViewProps & ChildProps) {
  const headerHeight = useHeaderHeight();
  return (
    <DefaultKeyboardAvoidingView
      {...props}
      style={StyleSheet.compose(style, styles.container)}
      keyboardVerticalOffset={headerHeight}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollViewContent: {
    flexGrow: 1
  }
});
