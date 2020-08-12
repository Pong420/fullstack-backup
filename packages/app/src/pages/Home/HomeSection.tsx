import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Bold } from '@/components/Text';
import { containerPadding } from '@/styles';

interface Props {
  label: string;
  children: React.ReactNode;
}

export function HomeSection({ label, children }: Props) {
  return (
    <View style={styles.container}>
      <Bold style={styles.label}>{label}</Bold>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    paddingHorizontal: containerPadding
  }
});
