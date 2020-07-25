import React from 'react';
import { SafeAreaView, Text, TouchableHighlight } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { User } from './pages/User';
import { useAuth } from './hooks/useAuth';
import { shadow } from './styles';

const Tab = createBottomTabNavigator();

export function Main() {
  return (
    <Tab.Navigator
      initialRouteName="User"
      tabBarOptions={{
        showLabel: false,
        style: {
          height: 90,
          ...shadow({
            shadowColor: '#ddd',
            shadowOffset: {
              width: 1,
              height: 1
            },
            shadowOpacity: 0.5
          })
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
      <Tab.Screen name="User" component={User} />
    </Tab.Navigator>
  );
}

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
