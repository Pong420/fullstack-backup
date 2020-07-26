import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRxAsync } from 'use-rx-hooks';
import { Feather } from '@expo/vector-icons';
import { getAddresses } from '@fullstack/common/service';
import { Header } from '../../../components/Header';
import { Text } from '../../../components/Text';
import { Button } from '../../../components/Button';
import { AddressForm } from '../../../components/AddressForm';
import { useBoolean } from '../../../hooks/useBoolean';
import { CreateAddressModal } from './CreateAddressModal';
import { Area } from '@fullstack/typings';
import { ScrollView } from 'react-native-gesture-handler';

function Empty() {
  return (
    <View style={styles.empty}>
      <Feather name="info" color="#666" size={50} />
      <Text>You have not add any deilvery address</Text>
    </View>
  );
}

export function DeliveryAddress() {
  const [modalOpend, openModal, closeModal] = useBoolean();
  const { data, loading } = useRxAsync(getAddresses, {});
  const addressses = data ? data.data.data : [];

  return (
    <>
      <Header title="Delivery Address" />
      <View style={styles.container}>
        {loading === false && addressses.length === 0 && <Empty />}
        <ScrollView>
          {addressses.map(({ id, area, address }) => (
            <View key={id} style={styles.card}>
              <View style={styles.cardHead}>
                <Feather name="trash-2" size={20} />
                <Feather name="edit" size={20} style={{ marginLeft: 10 }} />
              </View>
              <AddressForm
                area={area}
                editable={false}
                initialValues={address}
              />
            </View>
          ))}
        </ScrollView>
        <View style={styles.button}>
          <Button
            intent="DARK"
            title="New Delivery Address"
            onPress={openModal}
          />
        </View>
        <CreateAddressModal
          area={Area.HongKong}
          visible={modalOpend}
          onClose={closeModal}
          onCreated={() => {}}
        />
      </View>
    </>
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
    // paddingBottom: 0,
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
  button: {
    padding: containerPadding,
    shadowColor: '#ddd',
    shadowOffset: {
      width: 0,
      height: -4
    },
    shadowOpacity: 1,
    elevation: 1
  }
});
