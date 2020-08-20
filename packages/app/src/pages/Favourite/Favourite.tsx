import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { PageHeader } from '@/components/PageHeader';
import { ProductList } from '@/components/ProductList';
import { Empty } from '@/components/Empty';
import { Button } from '@/components/Button';
import { useFavouriteList } from '@/hooks/useFavourite';
import { useAuth } from '@/hooks/useAuth';
import { navigate } from '@/utils/navigation';

const pageHeader = <PageHeader text="Favourite" />;

export function Favourite() {
  const { loginStatus } = useAuth();
  const list = useFavouriteList();

  return (
    <SafeAreaView style={styles.grow}>
      {loginStatus === 'loggedIn' ? (
        list.length ? (
          <ProductList data={list} ListHeaderComponent={pageHeader} />
        ) : (
          <Empty content="You have not any favorite product added." />
        )
      ) : (
        <Empty content="Login Required">
          <Button
            intent="DARK"
            title="Login"
            onPress={() => navigate('Login')}
          />
        </Empty>
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
