import React from 'react';
import { SafeAreaView, Text, TouchableHighlight } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  createBottomTabNavigator,
  BottomTabBarOptions,
  BottomTabScreenProps,
  BottomTabNavigationOptions
} from '@react-navigation/bottom-tabs';
import { User } from './pages/User';
import { useAuth } from './hooks/useAuth';

const Tab = createBottomTabNavigator();

const tabBarOptions: BottomTabBarOptions = {
  showLabel: false,
  activeTintColor: '#182026',
  style: {
    height: 90
  },
  tabStyle: {
    padding: 5
  }
};

const screenOptions: (
  payload: BottomTabScreenProps<{}>
) => BottomTabNavigationOptions = ({ route }) => ({
  unmountOnBlur: true,
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
});

export function Main() {
  return (
    <Tab.Navigator
      initialRouteName="User"
      tabBarOptions={tabBarOptions}
      screenOptions={screenOptions}
    >
      <Tab.Screen name="Home" component={WIP} />
      <Tab.Screen name="Compass" component={WIP} />
      <Tab.Screen name="Favourite" component={WIP} />
      <Tab.Screen name="Cart" component={WIP} />
      <Tab.Screen name="User" component={User} />
    </Tab.Navigator>
  );
}

function WIP() {
  const { logout } = useAuth();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <TouchableHighlight onPress={() => logout()}>
        <Text>Working in progress</Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
}
