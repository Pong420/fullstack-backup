import React, { ReactNode } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useKeyboard } from '../hooks/useKeyboard';

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
        visbile
          ? {
              backgroundColor: '#fff',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -1
              },
              shadowOpacity: 0.15,
              shadowRadius: 10,
              elevation: 5
            }
          : {}
      )}
    />
  );
}
