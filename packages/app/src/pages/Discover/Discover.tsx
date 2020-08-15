import React, { useMemo, useRef, useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Animated,
  Keyboard
} from 'react-native';
import { useRxAsync } from 'use-rx-hooks';
import { getProducts } from '@fullstack/common/service';
import { Param$GetProducts } from '@fullstack/typings';
import { SearchInput, RNTextInputProps } from '@/components/SearchInput';
import { ProductList } from '@/components/ProductList';
import { InkPainting } from '@/components/Text';
import { useBoolean } from '@/hooks/useBoolean';
import { containerPadding } from '@/styles';
import { RecentSearches, updateRecentSearches } from './RecentSearches';

/**
 * TODO:
 * - clear all recenct search
 * - suggest
 * - no result
 * */

const delay = (ms: number) => new Promise(_ => setTimeout(_, ms));

const request = (params?: Param$GetProducts) =>
  delay(2000).then(() => getProducts(params).then(res => res.data.data));

export function Discover() {
  const anim = useRef(new Animated.Value(0));
  const [isFocused, onFocus, onBlur] = useBoolean();
  const [isAnimating, animatedStart, animateEnd] = useBoolean();
  const [offsetY, setOffsetY] = useState(0);
  const [search, setSearch] = useState('');
  const prevSearch = useRef(search);
  const { data: products, run } = useRxAsync(request, {
    defer: true
  });

  const { toggleCollapse, onSubmitEditing, onItemPress } = useMemo(() => {
    const toggleCollapse = (toValue: number) => {
      return new Promise(resolve => {
        Animated.spring(anim.current, {
          toValue,
          bounciness: 0,
          overshootClamping: false,
          useNativeDriver: true
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

    return {
      toggleCollapse,
      onSubmitEditing,
      onItemPress
    };
  }, []);

  const { run: animate } = useRxAsync(toggleCollapse, {
    defer: true,
    onStart: animatedStart,
    onSuccess: animateEnd
  });

  useEffect(() => {
    if (!isAnimating && !isFocused && search && search !== prevSearch.current) {
      prevSearch.current = search;
      run({ search });
    }
  }, [isAnimating, isFocused, search, run]);

  useEffect(() => {
    animate(isFocused ? 1 : 0);
  }, [isFocused, animate]);

  return (
    <SafeAreaView style={styles.grow}>
      <View style={styles.container}>
        <InkPainting style={styles.header}>Discover</InkPainting>
        <View onLayout={event => setOffsetY(event.nativeEvent.layout.y)} />
        <Animated.View
          style={[
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
              : []),
            styles.searchConainer
          ]}
        >
          <SearchInput
            placeholder="type ..."
            value={search}
            onChange={setSearch}
            onFocus={onFocus}
            onBlur={onBlur}
            onSubmitEditing={onSubmitEditing}
          />
          {isFocused && (
            <RecentSearches currentValue={search} onItemPress={onItemPress} />
          )}
        </Animated.View>
        <ProductList products={products?.data} total={products?.total} />
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
  header: {
    fontSize: 40,
    marginTop: 15,
    textAlign: 'center'
  },
  searchConainer: {
    paddingTop: 10,
    paddingHorizontal: containerPadding
  }
});
