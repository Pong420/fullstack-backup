import React from 'react';
import {
  createStackNavigator,
  StackNavigationOptions
} from '@react-navigation/stack';
import { UserConentList } from './UserConentList';
import { ChangePassword } from './ChangePassword';
import { headerScreenOptions } from '../../components/Header';

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
        name="ChangePassword"
        component={ChangePassword}
        options={{ title: 'Change Password' }}
      />
    </Stack.Navigator>
  );
}
