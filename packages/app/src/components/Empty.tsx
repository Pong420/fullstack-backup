import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { Logo } from './Logo';
import { InkPainting } from './Text';
import { containerPadding } from '@/styles';

interface Props extends ViewProps {
  content: ReactNode;
  children?: ReactNode;
  fontSize?: number;
}

export function Empty({
  style,
  fontSize = 40,
  content,
  children,
  ...props
}: Props) {
  return (
    <View {...props} style={[styles.empty, style]}>
      <View style={styles.container}>
        <Logo />
        <InkPainting fontSize={40}>{content}</InkPainting>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const container: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center'
};
const styles = StyleSheet.create({
  container,
  empty: {
    ...container,
    padding: containerPadding
  },
  content: {
    alignSelf: 'stretch'
  }
});
