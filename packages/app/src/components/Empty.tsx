import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text } from './Text';

interface Props {
  content: ReactNode;
}

export function Empty({ content }: Props) {
  return (
    <View style={styles.empty}>
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
