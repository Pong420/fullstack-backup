import React from 'react';
import {
  createStackNavigator,
  StackNavigationOptions
} from '@react-navigation/stack';
import { UserConentList } from './UserConentList';
import { ChangePassword } from './ChangePassword';
import { headerScreenOptions } from '../../components/Header';
import { Login, Registration } from '../Auth';

const Stack = createStackNavigator();

const screenOptions: StackNavigationOptions = {
  ...headerScreenOptions
};

export function User() {
  return (
    <Stack.Navigator screenOptions={screenOptions} headerMode="screen">
      <Stack.Screen
        name="User"
        component={UserConentList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Change Password"
        component={ChangePassword}
        options={{ title: 'Change Password' }}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Registration" component={Registration} />
    </Stack.Navigator>
  );
}
