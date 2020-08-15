import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { containerPadding } from '@/styles';
import { HomeBanners } from './HomeBanners';
import { HomeCategories } from './HomeCategories';
import { HomePopular } from './HomePopular';
import { HomeRecommend } from './HomeRecommend';

export function Home() {
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <HomeBanners />
        <HomeCategories />
        <HomePopular />
        <HomeRecommend />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: containerPadding
  }
});
