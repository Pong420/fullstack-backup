import 'react-native-gesture-handler';
import React from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { Main } from './src/Main';
import { fonts } from './src/components/Text';
import { ToastContainer } from './src/components/Toast';
import { AuthProvider } from './src/hooks/useAuth';
import { navigationRef } from './src/utils/navigation';

enableScreens();

const theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff'
  }
};

function App() {
  const [fontsLoaded] = useFonts(fonts);
  if (fontsLoaded) {
    return (
      <NavigationContainer theme={theme} ref={navigationRef}>
        <StatusBar style="auto" />
        <Main />
        <ToastContainer />
      </NavigationContainer>
    );
  }

  return null;
}

export default function () {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
