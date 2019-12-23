import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from '../../components/Text';
import { CloudinaryImage } from '../../components/CloudinaryImage';
import { Schema$Product } from '../../service';

interface Props {
  title: string;
  products: Schema$Product[];
  style?: ViewStyle;
}

export function HomeProductList({ title, products, style }: Props) {
  return (
    <View style={{ ...style, paddingHorizontal: 15 }}>
      <View style={{ alignItems: 'center' }}>
        <Text fontFamily="ink-painting" fontSize={28}>
          {`- ${title} -`}
        </Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <View
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 0.25
            },
            shadowOpacity: 0.5,
            shadowRadius: 1,
            elevation: 1
          }}
        >
          {products.map((product, index) => (
            <View
              key={product.id}
              style={{
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#000',
                backgroundColor: '#fff',
                overflow: 'hidden',
                flexDirection: 'row',
                marginTop: index && 20,
                padding: 10
              }}
            >
              <View
                style={{ flex: 1, paddingHorizontal: 5, paddingVertical: 7.5 }}
              >
                <Text fontFamily="ink-painting" fontSize={20}>
                  {`# ${product.name}`}
                </Text>
                <Text fontFamily="ink-painting" fontSize={18}>
                  {`$ ${product.price}`}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                {product.images.slice(0, 3).map((url, index) => (
                  <View key={index}>
                    <CloudinaryImage
                      id={url}
                      size={80}
                      style={{
                        borderRadius: 7,
                        overflow: 'hidden'
                      }}
                    />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
