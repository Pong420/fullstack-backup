import React from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Carousel } from '@/components/Carousel';
import { InkPainting } from '@/components/Text';
import { getProductCategories } from '@/service';
import { containerPadding, colors, shadow } from '@/styles';

const request = () =>
  getProductCategories().then(res => res.data.data.slice(0, 6));

export function Home() {
  const { data: categires } = useRxAsync(request, {});

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Carousel
          indicatorColor={colors.black}
          items={categires || []}
          onItemRender={({ item, style, index }) => (
            <View style={[style, { height: 250 }]} key={index}>
              <View style={styles.card}>
                <InkPainting style={styles.text}>{item.category}</InkPainting>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: containerPadding
  },
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
