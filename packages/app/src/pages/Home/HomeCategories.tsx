import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRxAsync } from 'use-rx-hooks';
import { Feather } from '@expo/vector-icons';
import { getProductCategories } from '@/service';
import { SemiBold } from '@/components/Text';
import { containerPadding, colors } from '@/styles';
import { HomeSection } from './HomeSection';

export function HomeCategories() {
  const { data } = useRxAsync(getProductCategories, {});
  const categires = (data && data.data.data) || [];

  return (
    <HomeSection label="Category">
      <ScrollView
        horizontal
        style={styles.content}
        showsHorizontalScrollIndicator={false}
      >
        {categires.map(({ category }) => (
          <View key={category} style={styles.category}>
            <View style={styles.image}>
              <Feather name="image" style={styles.imageIcon} size={32} />
            </View>
            <SemiBold style={styles.categoryName}>{category}</SemiBold>
          </View>
        ))}
      </ScrollView>
    </HomeSection>
  );
}

const imageSize = 60;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: containerPadding
  },
  category: {
    width: 80,
    alignItems: 'center',
    marginRight: 15
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: 50,
    borderWidth: 2.5,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 3,
    paddingLeft: 1
  },
  imageIcon: {
    color: colors.black
  },
  categoryName: {
    fontSize: 12,
    marginTop: 5,
    textTransform: 'capitalize'
  }
});
