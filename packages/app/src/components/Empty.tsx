import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text } from './Text';

interface Props extends ViewProps {
  content: ReactNode;
}

export function Empty({ content, style, ...props }: Props) {
  return (
    <View {...props} style={[styles.empty, style]}>
      <Feather name="info" color="#666" size={50} />
      <Text>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
