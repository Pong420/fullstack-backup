import React from 'react';
import { ViewStyle, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Schema$Product } from '@fullstack/typings';
import { useToggleFavourite } from '@/hooks/useFavourite';
import { colors, shadow } from '@/styles';

interface Props {
  product: Schema$Product;
  style?: ViewStyle;
}

export function ToggleFavourite({ product, style }: Props) {
  const [isFavourite, { toggleFavourite }] = useToggleFavourite(product.id);

  return (
    <TouchableOpacity
      onPress={() => {
        toggleFavourite([!isFavourite, product]);
      }}
    >
      <View
        style={[
          style,
          styles.container,
          isFavourite ? styles.background : undefined
        ]}
      >
        <View>
          <Feather
            name="heart"
            style={[styles.icon, isFavourite ? styles.iconSelected : undefined]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const size = 32;
const styles = StyleSheet.create({
  container: shadow(1, {
    width: size,
    height: size,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
    shadowOffsetY: 2
  }),
  background: {
    borderRadius: 50,
    backgroundColor: colors.red,
    borderColor: colors.red
  },
  icon: {
    color: colors.red,
    fontSize: 18
  },
  iconSelected: {
    color: '#fff'
  }
});
