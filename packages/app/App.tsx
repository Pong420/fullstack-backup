import React from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { Login } from './src/pages/Login';
import { fonts } from './src/components/Text';

export default function () {
  let [fontsLoaded] = useFonts(fonts);

  if (fontsLoaded) {
    return (
      <>
        <StatusBar style="auto" />
        <Login />
      </>
    );
  }

  return null;
}
