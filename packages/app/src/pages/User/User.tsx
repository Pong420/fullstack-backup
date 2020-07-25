import React from 'react';
import {
  createStackNavigator,
  StackNavigationOptions,
  StackScreenProps
} from '@react-navigation/stack';
import { UserConentList } from './UserConentList';
import { PersonalInfo } from './PersonalInfo';
import { ChangePassword } from './ChangePassword';
import { headerScreenOptions } from '../../components/Header';
import { ValidPassword } from '../../components/ValidPassword';
import { Login, Registration } from '../Auth';
import { useRef } from 'react';

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();

const mainScreenOptions: StackNavigationOptions = {
  ...headerScreenOptions
};

function MainStackScreen() {
  return (
    <MainStack.Navigator screenOptions={mainScreenOptions} headerMode="screen">
      <MainStack.Screen
        name="User"
        component={UserConentList}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="Personal Info"
        component={PersonalInfo}
        options={{ title: 'Personal Information' }}
      />
      <MainStack.Screen
        name="Change Password"
        component={ChangePassword}
        options={{ title: 'Change Password' }}
      />
      <MainStack.Screen name="Login" component={Login} />
      <MainStack.Screen name="Registration" component={Registration} />
    </MainStack.Navigator>
  );
}

function ValidPasswordModal({
  navigation
}: StackScreenProps<Record<string, undefined>>) {
  const onSuccess = useRef(() => navigation.navigate('Personal Info'));
  return <ValidPassword onSuccess={onSuccess.current} />;
}

export function User() {
  return (
    <RootStack.Navigator
      mode="modal"
      headerMode="screen"
      screenOptions={{ headerShown: false }}
    >
      <RootStack.Screen name="Main" component={MainStackScreen} />
      <RootStack.Screen name="ValidPassword" component={ValidPasswordModal} />
    </RootStack.Navigator>
  );
}
