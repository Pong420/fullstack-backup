import React from 'react';
import { View, Image, FlatList, StyleSheet, FlatListProps } from 'react-native';
import { Schema$Product } from '@fullstack/typings';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { ToggleFavourite } from '@/components/ToggleFavourite';
import { useFavouriteActions } from '@/hooks/useFavourite';
import { containerPadding, colors, shadow } from '@/styles';

export type Partial$Product = Schema$Product | { id: string };
type ListProps = FlatListProps<Partial$Product>;

interface Props extends Partial<ListProps> {
  data: Partial$Product[];
}

function isProduct(payload: Partial$Product): payload is Schema$Product {
  return 'name' in payload;
}

function Product(payload: Partial$Product) {
  const actions = useFavouriteActions();

  if (isProduct(payload)) {
    const { name, price, discount, images } = payload;
    const finalPrice = (price * discount) / 100;
    return (
      <View style={styles.product}>
        <View style={styles.productInner}>
          <View>
            <Image style={styles.thumbnail} source={{ uri: images[0] || '' }} />
          </View>
          <View style={styles.productContent}>
            <Text style={styles.productName}>{name}</Text>
            <Text style={styles.price}>
              ${finalPrice}
              {finalPrice !== price && (
                <Text style={styles.oroginPrice}> ${price}</Text>
              )}
            </Text>
          </View>
          <View style={styles.faviourite}>
            <ToggleFavourite product={payload} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.product}>
      <View style={styles.productInner}>
        <View style={styles.offshelf}>
          <Text style={styles.offsetText}>
            The product probably off the shelf
          </Text>
          <Button
            intent="DARK"
            title="Remove it from list"
            onPress={() => actions.delete(payload)}
          />
        </View>
      </View>
    </View>
  );
}

const defaultProps: Omit<ListProps, 'data'> = {
  keyExtractor: p => p.id,
  renderItem: ({ item }) => <Product {...item} />
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
const padding = 10;
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
    flex: 1,
    padding
  },
  thumbnail: {
    flex: 1,
    width: thunbnailWidth,
    height: thunbnailWidth * 0.8
  },
  productName: {
    lineHeight: fontSize * 1.4
  },
  price: {
    color: colors.textMuted,
    fontSize
  },
  oroginPrice: {
    color: colors.textMuted,
    fontSize,
    textDecorationLine: 'line-through'
  },
  faviourite: {
    paddingTop: padding * 1.2,
    paddingRight: padding
  },
  offshelf: {
    alignItems: 'stretch',
    flex: 1,
    padding
  },
  offsetText: {
    marginBottom: 10,
    textAlign: 'center'
  }
});
