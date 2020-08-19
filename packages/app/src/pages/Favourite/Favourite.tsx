import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { PageHeader } from '@/components/PageHeader';
import { useFavouriteList } from '@/hooks/useFavourite';
import { ProductList } from '@/components/ProductList';

export function Favourite() {
  const list = useFavouriteList();

  return (
    <SafeAreaView style={styles.grow}>
      <ProductList
        data={list}
        ListHeaderComponent={<PageHeader text="Favourite" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  grow: {
    flexGrow: 1
  },
  container: {
    flex: 1
  }
});
