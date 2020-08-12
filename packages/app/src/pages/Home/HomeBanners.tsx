import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Carousel } from '@/components/Carousel';
import { InkPainting } from '@/components/Text';
import { colors, shadow } from '@/styles';

interface Banner {
  name: string;
}

export const banners: Banner[] = [
  { name: 'Banner - 1' },
  { name: 'Banner - 2' },
  { name: 'Banner - 3' },
  { name: 'Banner - 4' }
];

export function HomeBanners() {
  return (
    <Carousel
      indicatorColor={colors.black}
      items={banners}
      onItemRender={({ item, style, index, width }) => (
        <View style={[style, { height: width / 2 }]} key={index}>
          <View style={styles.card}>
            <InkPainting style={styles.text}>{item.name}</InkPainting>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadow(4),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#000'
  },
  text: {
    textTransform: 'capitalize',
    fontSize: 50
  }
});
