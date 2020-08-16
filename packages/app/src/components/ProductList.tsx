import React from 'react';
import { View, Image, FlatList, StyleSheet, FlatListProps } from 'react-native';
import { Schema$Product } from '@fullstack/typings';
import { Text } from '@/components/Text';
import { containerPadding, colors, shadow } from '@/styles';

type ListProps = FlatListProps<Schema$Product>;
interface Props extends Partial<ListProps> {
  data: Schema$Product[];
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

const defaultProps: Omit<ListProps, 'data'> = {
  // keyExtractor: (p, index) => `${p.id}-${index}`,
  keyExtractor: p => p.id,
  renderItem: ({ item }) => <Product {...item}></Product>
};

export function ProductList({ contentContainerStyle, ...props }: Props) {
  return (
    <FlatList
      contentContainerStyle={[styles.contianer, contentContainerStyle]}
      onEndReachedThreshold={0.1}
      {...defaultProps}
      {...props}
    />
  );
}

const fontSize = 13;
const thunbnailWidth = 120;
const styles = StyleSheet.create({
  contianer: {
    flexGrow: 1,
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
    color: colors.textMuted,
    textDecorationLine: 'line-through'
  }
});
