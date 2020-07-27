import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRxAsync } from 'use-rx-hooks';
import { Feather } from '@expo/vector-icons';
import { Area } from '@fullstack/typings';
import { getAddresses, deleteAddress } from '@fullstack/common/service';
import {
  createStackNavigator,
  StackScreenProps
} from '@react-navigation/stack';
import { Header } from '../../../components/Header';
import { Text, SemiBold } from '../../../components/Text';
import { Button } from '../../../components/Button';
import { AddressForm } from '../../../components/AddressForm';
import { openConfirmModal } from '../../../components/ConfirmModal';
import { toaster } from '../../../components/Toast';
import { CreateAddressScreen } from './CreateAddressScreen';
import { UpdateAddressScreen } from './UpdateAddressScreen';
import { RootStackParamList } from './route';

function Empty() {
  return (
    <View style={styles.empty}>
      <Feather name="info" color="#666" size={50} />
      <Text>You have not add any deilvery address</Text>
    </View>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

const delay = (ms: number) => new Promise(_ => setTimeout(_, ms));

function MainScreen({ navigation }: StackScreenProps<RootStackParamList>) {
  const { data, loading } = useRxAsync(getAddresses, {});
  const addressses = data ? data.data.data : [];

  const removeAddressModal = (id: string, address: string[]) =>
    openConfirmModal({
      title: 'Remove Delivery Address',
      content: (
        <>
          Are you sure to remove the address{' '}
          <SemiBold color="#db3737">{address.join(' ')}</SemiBold>? This action
          is irreversible
        </>
      ),
      onConfirm: () =>
        delay(1000).then(() =>
          deleteAddress({ id }).catch(error => {
            toaster.apiError('Remove delivery address failure', error);
          })
        )
    });

  return (
    <>
      <Header title="Delivery Address" />
      <View style={styles.container}>
        {loading === false && addressses.length === 0 && <Empty />}
        <ScrollView bounces={false}>
          {addressses.map(payload => {
            const { id, area, address } = payload;
            return (
              <View key={id} style={styles.card}>
                <View style={styles.cardHead}>
                  <Feather
                    name="trash-2"
                    size={20}
                    onPress={() => removeAddressModal(id, address)}
                  />
                  <View style={styles.spacer} />
                  <Feather
                    name="edit"
                    size={20}
                    onPress={() => navigation.navigate('Update', payload)}
                  />
                </View>
                <AddressForm
                  area={area}
                  editable={false}
                  initialValues={address}
                />
              </View>
            );
          })}
        </ScrollView>
        <View style={styles.button}>
          <Button
            intent="DARK"
            title="New Delivery Address"
            onPress={() =>
              navigation.navigate('Create', { area: Area.HongKong })
            }
          />
        </View>
      </View>
    </>
  );
}

export function DeliveryAddress() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal">
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="Create" component={CreateAddressScreen} />
      <Stack.Screen name="Update" component={UpdateAddressScreen} />
    </Stack.Navigator>
  );
}

const containerPadding = 24;
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    flex: 1,
    marginHorizontal: containerPadding,
    padding: containerPadding,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginBottom: containerPadding,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },
  cardHead: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  spacer: {
    width: 20
  },
  button: {
    padding: containerPadding
  }
});
