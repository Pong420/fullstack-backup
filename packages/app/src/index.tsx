import React from 'react';
import { Login } from './pages/Login';
import { fonts } from './components/Text';
import { useFonts } from 'expo-font';

export function App() {
  let [fontsLoaded] = useFonts(fonts);

  if (fontsLoaded) {
    return <Login />;
  }

  return null;
}
