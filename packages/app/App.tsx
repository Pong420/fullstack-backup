import 'react-native-gesture-handler';
import React from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, TouchableHighlight } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Login } from './src/pages/Login';
import { User } from './src/pages/User';
import { fonts } from './src/components/Text';
import { ToastContainer } from './src/components/Toast';
import { AuthProvider, useAuth } from './src/hooks/useAuth';

enableScreens();

const Tab = createBottomTabNavigator();

function Temp() {
  const { logout } = useAuth();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <TouchableHighlight onPress={logout}>
        <Text>Working in progress</Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
}

const theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff'
  }
};

function MainStack() {
  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        initialRouteName="User"
        tabBarOptions={{
          showLabel: false,
          style: {
            height: 90,
            elevation: 8,
            shadowColor: '#ddd',
            shadowOffset: {
              width: 1,
              height: 1
            },
            shadowOpacity: 0.5,
            shadowRadius: 1
          },
          tabStyle: {
            padding: 5
          }
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const name = (() => {
              switch (route.name) {
                case 'Favourite':
                  return 'heart';
                case 'Cart':
                  return 'shopping-cart';
                default:
                  return route.name.toLowerCase();
              }
            })();
            return <Feather name={name} size={size} color={color} />;
          }
        })}
      >
        <Tab.Screen name="Home" component={Temp} />
        <Tab.Screen name="Compass" component={Temp} />
        <Tab.Screen name="Favourite" component={Temp} />
        <Tab.Screen name="Cart" component={Temp} />
        <Tab.Screen name="User" component={User} options={{ title: 'User' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function App() {
  const [fontsLoaded] = useFonts(fonts);
  const { loginStatus } = useAuth();

  if (fontsLoaded) {
    return (
      <>
        <StatusBar style="auto" />
        {loginStatus !== 'loggedIn' ? <Login /> : <MainStack />}
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
