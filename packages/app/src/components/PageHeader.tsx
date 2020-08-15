import React from 'react';
import { View, StyleSheet } from 'react-native';
import { InkPainting } from './Text';

interface Props {
  text: string;
}

export function PageHeader({ text }: Props) {
  return (
    <View style={styles.header}>
      <InkPainting fontSize={50}>{text}</InkPainting>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 30
  }
});
