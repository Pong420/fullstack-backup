import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { PageHeader } from '@/components/PageHeader';
import { ProductList } from '@/components/ProductList';
import { Empty } from '@/components/Empty';
import { Button } from '@/components/Button';
import { useFavouriteList } from '@/hooks/useFavourite';
import { useAuth } from '@/hooks/useAuth';

const pageHeader = <PageHeader text="Favourite" />;

function NotAuthenticated() {
  return (
    <Empty
      style={{ flex: 1, justifyContent: 'center' }}
      content="Login Required"
    >
      <Button intent="DARK" title="Login" />
    </Empty>
  );
}

export function Favourite() {
  const { loginStatus } = useAuth();
  const list = useFavouriteList();

  return (
    <SafeAreaView style={styles.grow}>
      {loginStatus === 'loggedIn' ? (
        list.length ? null : (
          <ProductList data={list} ListHeaderComponent={pageHeader} />
        )
      ) : (
        <NotAuthenticated />
      )}
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
