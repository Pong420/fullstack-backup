import React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Schema$Product } from '@fullstack/typings';
import { containerPadding, shadow, colors } from '@/styles';
import { SemiBold, Text } from '@/components/Text';

interface Props {
  products: Schema$Product[];
}

export function HomeProductsSlide({ products }: Props) {
  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.scroller}
      showsHorizontalScrollIndicator={false}
    >
      {products.map(({ id, images, name, category, price, discount }) => {
        const finalPrice = (price * discount) / 100;

        return (
          <View key={id} style={styles.card}>
            <View style={styles.cardContent}>
              <Image
                style={styles.thumbnail}
                source={{ uri: images[0] || '' }}
              />
              <View style={styles.footer}>
                <SemiBold style={styles.productName}>{name}</SemiBold>
                <Text style={styles.category}>{category}</Text>

                <View style={styles.footerBottom}>
                  <Text style={styles.price}>
                    ${finalPrice}
                    {finalPrice !== price && (
                      <Text style={styles.oroginPrice}> ${price}</Text>
                    )}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const width = 180;
const fontSize = 14;
const spaceBetweenCard = 14;
const styles = StyleSheet.create({
  scroller: {
    paddingHorizontal: containerPadding - spaceBetweenCard / 2,
    paddingBottom: 10
  },
  card: {
    ...shadow(1),
    width,
    marginHorizontal: spaceBetweenCard / 2
  },
  cardContent: {
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  thumbnail: {
    height: (width * 617) / 925
  },
  footer: {
    paddingTop: 5,
    paddingBottom: 10,
    paddingHorizontal: 10,
    height: 100
  },
  productName: {
    fontSize,
    lineHeight: fontSize * 1.2
  },
  category: {
    fontSize: fontSize - 1,
    lineHeight: (fontSize - 1) * 1.2,
    color: colors.textMuted
  },
  footerBottom: {
    flexGrow: 1,
    alignSelf: 'flex-end',
    justifyContent: 'flex-end'
  },
  price: {
    fontSize
  },
  oroginPrice: {
    fontSize,
    textDecorationLine: 'line-through'
  }
});
