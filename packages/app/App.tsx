import 'react-native-gesture-handler';
import React from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { Main } from './src/Main';
import { Login, Registration } from './src/pages/Auth';
import { fonts } from './src/components/Text';
import { ToastContainer } from './src/components/Toast';
import { ConfirmModalContainer } from './src/components/ConfirmModal';
import { AuthProvider } from './src/hooks/useAuth';
import { FavouriteProvider } from './src/hooks/useFavourite';
import { navigationRef } from './src/utils/navigation';
import {
  createStackNavigator,
  StackNavigationOptions
} from '@react-navigation/stack';

enableScreens();

const theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff'
  }
};

const screenOptions: StackNavigationOptions = { headerShown: false };

const Stack = createStackNavigator();

function App() {
  const [fontsLoaded] = useFonts(fonts);
  if (fontsLoaded) {
    return (
      <>
        <StatusBar style="auto" />
        <Main />
        <ConfirmModalContainer />
        <ToastContainer />
      </>
    );
  }

  return null;
}

export default function () {
  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
      <AuthProvider>
        <FavouriteProvider>
          <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name="App" component={App} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Registration" component={Registration} />
          </Stack.Navigator>
        </FavouriteProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
