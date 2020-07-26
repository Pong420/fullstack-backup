import React from 'react';
import {
  createStackNavigator,
  StackNavigationOptions
} from '@react-navigation/stack';
import { UserConentList } from './UserConentList';
import {
  PersonalInfo,
  NewEmailModal,
  NewNickNameModal,
  ValidPasswordModal
} from './PersonalInfo';
import { ChangePassword } from './ChangePassword';
import { DeliveryAddress } from './DeliveryAddress';
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
      <MainStack.Screen
        name={Paths.DeliveryAddress}
        component={DeliveryAddress}
      />
      <MainStack.Screen name={Paths.Login} component={Login} />
      <MainStack.Screen name={Paths.Registration} component={Registration} />
    </MainStack.Navigator>
  );
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
      <RootStack.Screen name={Paths.NewNickName} component={NewNickNameModal} />
      <RootStack.Screen name={Paths.NewEmail} component={NewEmailModal} />
    </RootStack.Navigator>
  );
}
