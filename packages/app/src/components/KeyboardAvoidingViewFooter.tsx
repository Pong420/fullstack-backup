import React, { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';
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
      style={[
        style,
        visbile ? shadow(4, { shadowOffsetY: -2, backgroundColor: '#fff' }) : {}
      ]}
    />
  );
}
