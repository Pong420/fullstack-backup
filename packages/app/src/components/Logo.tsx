import React from 'react';
import { View, TextStyle, ViewStyle } from 'react-native';
import { Text } from './Text';
import { dimen } from '../styles';
import Cart from '../assets/cart.svg';

interface Props {
  size?: number;
  color?: TextStyle['color'];
  style?: ViewStyle;
}

export function Logo({ style, size = 70, color = '#000' }: Props) {
  return (
    <View
      style={{
        ...style,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text fontFamily="ink-painting" fontSize={size} style={{ color }}>
        Buyar
      </Text>
      <View style={{ marginTop: (4 / 7) * size, marginLeft: (-1 / 7) * size }}>
        <Cart style={{ ...dimen((3 / 7) * size) }} color={color}></Cart>
      </View>
    </View>
  );
}
