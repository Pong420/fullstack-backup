import React from 'react';
import {
  createStackNavigator,
  StackNavigationOptions
} from '@react-navigation/stack';
import { UserConentList } from './UserConentList';
import { PersonalInfo } from './PersonalInfo';
import { ChangePassword } from './ChangePassword';
import { DeliveryAddress } from './DeliveryAddress';
import { ValidatePasswordScreen } from './ValidatePasswordScreen';
import { UserStackParamList } from './constants';

const screenOptions: StackNavigationOptions = {
  headerShown: false
};

const UserStack = createStackNavigator<UserStackParamList>();

export function User() {
  return (
    <UserStack.Navigator screenOptions={screenOptions} headerMode="screen">
      <UserStack.Screen name="User" component={UserConentList} />
      <UserStack.Screen name="PersonalInfo" component={PersonalInfo} />
      <UserStack.Screen name="ChangePassword" component={ChangePassword} />
      <UserStack.Screen name="DeliveryAddress" component={DeliveryAddress} />
      <UserStack.Screen
        name="ValidatePassword"
        component={ValidatePasswordScreen}
      />
    </UserStack.Navigator>
  );
}
