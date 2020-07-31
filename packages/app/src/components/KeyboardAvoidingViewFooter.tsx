import React, { ReactNode } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useKeyboard } from '@/hooks/useKeyboard';
import { shadow } from '@/styles';

interface Props extends ViewProps {
  shadowColor?: string;
  children?: ReactNode;
}

export function KeyboardAvoidingViewFooter({
  style,
  shadowColor = '#ddd',
  ...props
}: Props) {
  const visbile = useKeyboard();
  return (
    <View
      {...props}
      style={StyleSheet.compose(
        style,
        visbile ? shadow(4, { shadowOffsetY: -2 }) : {}
      )}
    />
  );
}
