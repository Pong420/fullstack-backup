import React from 'react';
import { View, Image, FlatList, StyleSheet } from 'react-native';
import { Schema$Product } from '@fullstack/typings';
import { Text } from '@/components/Text';
import { containerPadding, colors, shadow } from '@/styles';

interface Props {
  total?: number;
  products?: Schema$Product[];
}

function Product({ name, price, discount, images }: Schema$Product) {
  const finalPrice = (price * discount) / 100;

  return (
    <View style={styles.product}>
      <View style={styles.productInner}>
        <View>
          <Image style={styles.thumbnail} source={{ uri: images[0] || '' }} />
        </View>
        <View style={styles.productContent}>
          <Text>{name}</Text>
          <Text style={styles.price}>
            ${finalPrice}
            {finalPrice !== price && (
              <Text style={styles.oroginPrice}> ${price}</Text>
            )}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function ProductList({ products, total }: Props) {
  return (
    <FlatList
      // ListHeaderComponent={
      //   total ? (
      //     <View style={styles.header}>
      //       <Text>Total {total} results</Text>
      //     </View>
      //   ) : null
      // }
      // bounces={false}
      contentContainerStyle={styles.contianer}
      data={products}
      keyExtractor={p => p.id}
      renderItem={({ item }) => <Product {...item}></Product>}
    />
  );
}

const fontSize = 13;
const thunbnailWidth = 120;
const styles = StyleSheet.create({
  contianer: {
    paddingHorizontal: containerPadding,
    paddingBottom: 20
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingBottom: 10
  },
  product: shadow(3, {
    marginTop: 15
  }),
  productInner: {
    flexDirection: 'row',
    borderRadius: 4,
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  productContent: {
    padding: 10
  },
  thumbnail: {
    flex: 1,
    width: thunbnailWidth,
    height: thunbnailWidth * 0.8
  },
  price: {
    fontSize,
    color: colors.textMuted
  },
  oroginPrice: {
    fontSize,
    textDecorationLine: 'line-through'
  }
});
