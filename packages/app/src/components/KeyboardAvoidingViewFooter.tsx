import React, { ReactNode } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useKeyboard } from '../hooks/useKeyboard';

interface Props extends ViewProps {
  shadowColor?: string;
  children?: ReactNode;
}

export function KeyboardAvoidingViewFooter({
  style,
  shadowColor = '#ddd5',
  ...props
}: Props) {
  const visbile = useKeyboard();
  return (
    <View
      {...props}
      style={StyleSheet.compose(
        style,
        visbile
          ? {
              shadowColor,
              shadowOffset: {
                width: 0,
                height: -4
              },
              shadowOpacity: 1,
              elevation: 1
            }
          : {}
      )}
    />
  );
}
