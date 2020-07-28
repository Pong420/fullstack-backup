import React from 'react';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  createStackNavigator,
  StackNavigationOptions,
  StackScreenProps
} from '@react-navigation/stack';
import { Text, SemiBold } from '../../../components/Text';
import { Header } from '../../../components/Header';
import { card, containerPadding, colors } from '../../../styles';
import { ValidPasswordModal } from './ValidPasswordModal';
import { NewEmailModal, NewNickNameModal } from './UpdateUser';
import { PersonalInfoParamList } from './routes';

interface ItemProps {
  label: string;
  value?: string;
  onEdit?: () => void;
}

const screenOptions: StackNavigationOptions = {
  headerShown: false
};

const Stack = createStackNavigator<PersonalInfoParamList>();

function Item({ label, value, onEdit }: ItemProps) {
  return (
    <View style={styles.item}>
      <Text style={styles.itemLabel} fontSize={14}>
        {label}
      </Text>
      <View style={styles.itemValue}>
        <Text>{value}</Text>
        {typeof onEdit !== 'undefined' && (
          <TouchableNativeFeedback onPress={onEdit}>
            <Feather name="edit" size={16} />
          </TouchableNativeFeedback>
        )}
      </View>
    </View>
  );
}

function MainScreen({
  navigation,
  route
}: StackScreenProps<PersonalInfoParamList, 'Main'>) {
  const { user } = route.params;

  return (
    <>
      <Header title="Personal Infomation" />
      <View style={styles.container}>
        <View style={styles.card}>
          <SemiBold>Account Information</SemiBold>
          <Item
            label="Username"
            value={user.username.substring(0, 3) + '*******'}
          />
          <Item
            label="Nickname"
            value={user.nickname}
            onEdit={() => navigation.navigate('NewNickName')}
          />
          <Item
            label="Email address"
            value={user.email}
            onEdit={() => navigation.navigate('NewEmail')}
          />
        </View>
      </View>
    </>
  );
}

export function PersonalInfo() {
  return (
    <Stack.Navigator mode="modal" screenOptions={screenOptions}>
      <Stack.Screen name="ValidatePassword" component={ValidPasswordModal} />
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="NewNickName" component={NewNickNameModal} />
      <Stack.Screen name="NewEmail" component={NewEmailModal} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: containerPadding, paddingTop: 0 },
  card: {
    ...card
  },
  item: {
    marginTop: 20
  },
  itemLabel: {
    color: colors.textMuted
  },
  itemValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});
