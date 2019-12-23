import React from 'react';
import { SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { useRxAsync } from 'use-rx-async';
import { Logo } from '../../components/Logo';
import { Banner } from '../../components/Banner';
import { HomeProductList } from './HomeProductList';
import { getProducts } from '../../service';
import Carousel from 'react-native-snap-carousel';

const request = () => getProducts({ pageSize: 5 }).then(res => res.data.data);

function Popular() {
  const { data } = useRxAsync(request);
  return (
    <HomeProductList
      title="Popular"
      style={{ marginTop: 30 }}
      products={data ? data.docs : []}
    />
  );
}

function YouMayInterested() {
  const { data } = useRxAsync(request);
  return (
    <HomeProductList
      title="You May Interested"
      style={{ marginTop: 50 }}
      products={data ? data.docs : []}
    />
  );
}

const banners = ['Clothes', 'Jewellery', 'Food', 'Games'];

const sliderWidth = Dimensions.get('window').width;
const horizontalMargin = sliderWidth * 0.01;
const itemWidth = sliderWidth * 0.7 + horizontalMargin * 2;

export function Home() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Logo size={50} style={{ marginVertical: 10 }} />
        <Carousel
          data={banners}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          containerCustomStyle={{ flexGrow: 0, marginBottom: 20 }}
          renderItem={({ item }) => (
            <Banner text={item} size={itemWidth} space={horizontalMargin} />
          )}
        />
        <Popular />
        <YouMayInterested />
      </ScrollView>
    </SafeAreaView>
  );
}
