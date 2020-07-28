import React, { useLayoutEffect, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRxAsync } from 'use-rx-hooks';
import { Feather } from '@expo/vector-icons';
import { Area, Schema$Address } from '@fullstack/typings';
import { getAddresses, deleteAddress } from '@fullstack/common/service';
import {
  createStackNavigator,
  StackScreenProps
} from '@react-navigation/stack';
import { Header } from '../../../components/Header';
import { SemiBold } from '../../../components/Text';
import { Button } from '../../../components/Button';
import { AddressForm } from '../../../components/AddressForm';
import { openConfirmModal } from '../../../components/ConfirmModal';
import { toaster } from '../../../components/Toast';
import { Empty } from '../../../components/Empty';
import { createUseCRUDReducer } from '../../../hooks/crud';
import { CreateAddressScreen } from './CreateAddressScreen';
import { UpdateAddressScreen } from './UpdateAddressScreen';
import { DeliveryAddressParamList } from './routes';

const Stack = createStackNavigator<DeliveryAddressParamList>();

const useAddressReducer = createUseCRUDReducer<Schema$Address, 'id'>('id');

const request = () => getAddresses().then(res => res.data.data);
function MainScreen({
  navigation,
  route
}: StackScreenProps<DeliveryAddressParamList, 'Main'>) {
  const [state, actions] = useAddressReducer();
  const { loading } = useRxAsync(request, {
    effect: useLayoutEffect,
    onSuccess: actions.list
  });
  const addressses = state.list;

  useEffect(() => {
    if (route.params?.action) {
      actions.dispatch(route.params.action);
    }
  }, [route, actions]);

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
        deleteAddress({ id })
          .then(() => actions.delete({ id }))
          .catch(error => {
            toaster.apiError('Remove delivery address failure', error);
          })
    });

  return (
    <>
      <Header title="Delivery Address" />
      <View style={styles.container}>
        {loading === false && addressses.length === 0 && (
          <Empty content="You have not add any deilvery address" />
        )}
        <ScrollView bounces={false} style={styles.scrollView}>
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
                  key={JSON.stringify(address)}
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
  scrollView: {
    paddingVertical: 5
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
    shadowRadius: 2.72,
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
