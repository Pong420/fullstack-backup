import React from 'react';
import { View, FlatList } from 'react-native';
import { useRxAsync } from 'use-rx-async';
import { Text } from '../components/Text';
import { getProducts } from '../service';
import { SafeAreaView } from 'react-navigation';

const request = () => getProducts().then(res => res.data.data);

export function Home() {
  const { data, loading } = useRxAsync(request);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading....</Text>
      </View>
    );
  }

  if (data) {
    const { docs } = data;
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <FlatList
          data={docs}
          renderItem={({ item: product }) => (
            <View>
              <Text>{product.name}</Text>
            </View>
          )}
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Error!</Text>
    </View>
  );
}
