import React, { useMemo, useRef, useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Animated,
  Keyboard,
  ViewProps,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { useRxAsync } from 'use-rx-hooks';
import { Param$GetProducts, Schema$Product } from '@fullstack/typings';
import { SearchInput, RNTextInputProps } from '@/components/SearchInput';
import { ProductList } from '@/components/ProductList';
import { PageHeader } from '@/components/PageHeader';
import { Text } from '@/components/Text';
import { useBoolean, createUseCRUDReducer } from '@fullstack/common/hooks';
import { getProducts } from '@/service';
import { containerPadding, colors } from '@/styles';
import { Empty } from '@/components/Empty';
import { RecentSearches, updateRecentSearches } from './RecentSearches';

/**
 * TODO:
 * - suggest
 * */

const request = (params?: Param$GetProducts) =>
  getProducts(params).then(res => {
    const payload = res.data.data;
    return {
      ...payload,
      pageNo: payload.page
    };
  });

const useProductReducer = createUseCRUDReducer<Schema$Product, 'id'>('id');

export function Discover() {
  const anim = useRef(new Animated.Value(0));
  const [isFocused, onFocus, onBlur] = useBoolean();
  const [isAnimating, animatedStart, animateEnd] = useBoolean();
  const [offsetY, setOffsetY] = useState(0);
  const [inputHeight, setInputHeight] = useState(0);
  const [search, setSearch] = useState('');
  const prevSearch = useRef(search);

  const [product, actions] = useProductReducer();
  const [{ loading }, { fetch }] = useRxAsync(request, {
    defer: true,
    onSuccess: actions.paginate
  });

  const {
    toggleCollapse,
    onSubmitEditing,
    onItemPress,
    handleOffsetY,
    handleInputHeight
  } = useMemo(() => {
    const toggleCollapse = (toValue: number) => {
      return new Promise(resolve => {
        Animated.spring(anim.current, {
          toValue,
          useNativeDriver: true,
          overshootClamping: true
        }).start(resolve);
      });
    };

    const onSubmitEditing: RNTextInputProps['onSubmitEditing'] = event => {
      const value = event.nativeEvent.text;
      if (value) {
        updateRecentSearches(event.nativeEvent.text);
      }
    };

    const onItemPress = (value: string) => {
      setSearch(value);
      Keyboard.dismiss();
    };

    const handleOffsetY: ViewProps['onLayout'] = event =>
      setOffsetY(event.nativeEvent.layout.y);
    const handleInputHeight: ViewProps['onLayout'] = event =>
      setInputHeight(event.nativeEvent.layout.height);

    return {
      toggleCollapse,
      onSubmitEditing,
      onItemPress,
      handleOffsetY,
      handleInputHeight
    };
  }, []);

  const [, { fetch: animate }] = useRxAsync(toggleCollapse, {
    defer: true,
    onStart: animatedStart,
    onSuccess: animateEnd
  });

  useEffect(() => {
    if (!isFocused && search && search !== prevSearch.current) {
      prevSearch.current = search;
      actions.reset();
      fetch({ search, page: 1 });
    }
  }, [isFocused, search, fetch, actions]);

  return (
    <SafeAreaView style={styles.grow}>
      <View style={styles.container}>
        <PageHeader text="Discover" />
        <View onLayout={handleOffsetY} />
        <Animated.View
          style={[
            { paddingTop: 10 },
            ...(isAnimating || isFocused
              ? [
                  StyleSheet.absoluteFill,
                  styles.container,
                  {
                    zIndex: 1,
                    transform: [
                      {
                        translateY: anim.current.interpolate({
                          inputRange: [0, 1],
                          outputRange: [offsetY, 0]
                        })
                      }
                    ]
                  }
                ]
              : [])
          ]}
        >
          <View style={styles.searchInputConainer}>
            <View style={styles.searchInput}>
              <SearchInput
                onLayout={handleInputHeight}
                placeholder="type ..."
                returnKeyType="search"
                value={search}
                onChange={setSearch}
                onFocus={() => {
                  animate(1);
                  onFocus();
                }}
                onBlur={() => {
                  animate(0);
                  onBlur();
                }}
                onSubmitEditing={onSubmitEditing}
              />
            </View>
            {isFocused && (
              <TouchableOpacity
                onPress={() => {
                  animate(0);
                  Keyboard.dismiss();
                }}
              >
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={inputHeight}
            style={styles.grow}
          >
            {isFocused && (
              <RecentSearches currentValue={search} onItemPress={onItemPress} />
            )}
          </KeyboardAvoidingView>
        </Animated.View>

        {/* TODO: loading */}

        <ProductList
          data={product.list as any} // TODO:
          ListEmptyComponent={
            !search || loading || product.total > 0 ? undefined : (
              <Empty content="Products not found" />
            )
          }
          onEndReached={() => {
            const hasNext = product.total > product.ids.length;
            if (hasNext && !loading && product.ids.length) {
              fetch({ search, page: product.pageNo + 1 });
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  grow: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  searchInputConainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: containerPadding
  },
  searchInput: {
    flex: 1
  },
  cancelButton: {
    color: colors.blue,
    marginRight: containerPadding * -0.5,
    paddingHorizontal: 10
  }
});
