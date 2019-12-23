import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { dimen } from '../styles';

interface Props {
  text?: string;
  size: number;
  space: number;
}

const ratio = 9 / 16;

export function Banner({ size, text, space }: Props) {
  return (
    <View style={{ ...dimen(size, size * ratio), paddingHorizontal: space }}>
      <View
        style={{
          flex: 1,
          borderWidth: 1.5,
          borderColor: '#000',
          backgroundColor: '#fff',

          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text fontFamily="ink-painting" fontSize={50} style={{ marginTop: 15 }}>
          {text}
        </Text>
      </View>
    </View>
  );
}
