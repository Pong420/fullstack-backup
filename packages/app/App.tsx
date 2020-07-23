import 'react-native-gesture-handler';
import React from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { Login } from './src/pages/Login';
import { Main } from './src/Main';
import { fonts } from './src/components/Text';
import { ToastContainer } from './src/components/Toast';
import { AuthProvider } from './src/hooks/useAuth';

enableScreens();

const Stack = createNativeStackNavigator();

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
      <NavigationContainer theme={theme}>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Main"
            component={Main}
            // options={{ headerShown: false }}
          />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
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
