import React from 'react';
import { SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  createBottomTabNavigator,
  BottomTabBarOptions,
  BottomTabScreenProps,
  BottomTabNavigationOptions
} from '@react-navigation/bottom-tabs';
import { Home } from './pages/Home';
import { User } from './pages/User';
import { Discover } from './pages/Discover';
import { Favourite } from './pages/Favourite';
import { Logo } from './components/Logo';
import { InkPainting } from './components/Text';
import { colors } from './styles';

const Tab = createBottomTabNavigator();

const tabBarOptions: BottomTabBarOptions = {
  showLabel: false,
  activeTintColor: colors.black,
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
      initialRouteName="Favourite"
      tabBarOptions={tabBarOptions}
      screenOptions={screenOptions}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Compass" component={Discover} />
      <Tab.Screen name="Favourite" component={Favourite} />
      <Tab.Screen name="Cart" component={WIP} />
      <Tab.Screen name="User" component={User} />
    </Tab.Navigator>
  );
}

function WIP() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Logo />
      <InkPainting fontSize={30}>Working in progress</InkPainting>
    </SafeAreaView>
  );
}
