import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { Logo } from './Logo';
import { InkPainting } from './Text';
import { containerPadding } from '@/styles';

interface Props extends ViewProps {
  content: ReactNode;
  children?: ReactNode;
  fontSize?: number;
  logo?: boolean;
}

export function Empty({
  style,
  fontSize = 30,
  logo = true,
  content,
  children,
  ...props
}: Props) {
  return (
    <View {...props} style={[styles.empty, style]}>
      <View style={styles.container}>
        {logo && <Logo />}
        <InkPainting fontSize={fontSize} style={styles.text}>
          {content}
        </InkPainting>
      </View>
      <View style={styles.extraContent}>{children}</View>
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
  text: { textAlign: 'center' },
  extraContent: {
    alignSelf: 'stretch'
  }
});
