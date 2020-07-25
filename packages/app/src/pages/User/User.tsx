import React, { useRef } from 'react';
import {
  createStackNavigator,
  StackNavigationOptions,
  StackScreenProps
} from '@react-navigation/stack';
import { UserConentList } from './UserConentList';
import { PersonalInfo } from './PersonalInfo';
import { ChangePassword } from './ChangePassword';
import { ValidPassword } from '../../components/ValidPassword';
import { Login, Registration } from '../Auth';
import { Paths } from './constants';

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();

const screenOptions: StackNavigationOptions = {
  headerShown: false
};

function MainStackScreen() {
  return (
    <MainStack.Navigator screenOptions={screenOptions} headerMode="screen">
      <MainStack.Screen name={Paths.User} component={UserConentList} />
      <MainStack.Screen name={Paths.PeronsalInfo} component={PersonalInfo} />
      <MainStack.Screen
        name={Paths.ChangePassword}
        component={ChangePassword}
      />
      <MainStack.Screen name={Paths.Login} component={Login} />
      <MainStack.Screen name={Paths.Registration} component={Registration} />
    </MainStack.Navigator>
  );
}

function ValidPasswordModal({
  navigation
}: StackScreenProps<Record<string, undefined>>) {
  const onSuccess = useRef(() => navigation.navigate(Paths.PeronsalInfo));
  return <ValidPassword onSuccess={onSuccess.current} />;
}

export function User() {
  return (
    <RootStack.Navigator
      mode="modal"
      headerMode="screen"
      screenOptions={screenOptions}
    >
      <RootStack.Screen name="Main" component={MainStackScreen} />
      <RootStack.Screen
        name={Paths.VaildatePassword}
        component={ValidPasswordModal}
      />
    </RootStack.Navigator>
  );
}
