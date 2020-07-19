import React from 'react';
import { SafeAreaView } from 'react-native';
import { Logo } from '../../components/Logo';

export function Home() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <Logo />
    </SafeAreaView>
  );
}
