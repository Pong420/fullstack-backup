import React from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, TouchableHighlight } from 'react-native';
import { Login } from './src/pages/Login';
import { fonts } from './src/components/Text';
import { ToastContainer } from './src/components/Toast';
import { AuthProvider, useAuth } from './src/hooks/useAuth';

function App() {
  const [fontsLoaded] = useFonts(fonts);
  const { loginStatus, logout } = useAuth();

  if (fontsLoaded) {
    return (
      <>
        <StatusBar style="auto" />
        {loginStatus === 'loggedIn' ? (
          <SafeAreaView
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <TouchableHighlight onPress={logout}>
              <Text>Logged in</Text>
            </TouchableHighlight>
          </SafeAreaView>
        ) : (
          <Login />
        )}
        <ToastContainer />
      </>
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
