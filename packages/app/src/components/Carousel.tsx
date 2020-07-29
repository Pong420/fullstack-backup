import React, { useRef, useEffect, useMemo, ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  Animated,
  View,
  ViewStyle,
  useWindowDimensions
} from 'react-native';
import { fromEventPattern, timer } from 'rxjs';
import { tap, switchMap, map, startWith } from 'rxjs/operators';

export type OnItemRender<T> = (payload: {
  item: T;
  style: ViewStyle;
  index: number;
}) => ReactNode;

export interface CarouselProps<T> {
  items: T[];
  onItemRender: OnItemRender<T>;
  loop?: boolean;
  autoplay?: boolean;
  autoplayNextDuration?: number;
  indicatorColor?: ViewStyle['backgroundColor'];
}

export function Carousel<T>({
  items: defaultItems,
  onItemRender,
  loop = true,
  autoplay = true,
  autoplayNextDuration = 7000,
  indicatorColor = '#ccc'
}: CarouselProps<T>) {
  const scrollX = useRef(new Animated.Value(0));
  const scrollViewRef = useRef<ScrollView>(null);

  const { width: windowWidth } = useWindowDimensions();

  const { items, length } = useMemo(
    () => ({
      length: defaultItems.length,
      items: loop
        ? [
            ...defaultItems.slice(-1),
            ...defaultItems,
            ...defaultItems.slice(0, 1)
          ]
        : defaultItems
    }),
    [defaultItems, loop]
  );

  const { onScroll, scrollTo } = useMemo(() => {
    const onScroll = Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX.current
            }
          }
        }
      ],
      { useNativeDriver: false }
    );

    const scrollTo = (x: number, animated = false) => {
      const scrollView = scrollViewRef.current;
      if (scrollView) {
        scrollView.scrollTo({ x, y: 0, animated });
      }
    };

    return { onScroll, scrollTo };
  }, []);

  useEffect(() => {
    let subscriptionId = '';
    const initialOffsetX = windowWidth;
    const subscription = fromEventPattern<{ value: number }>(
      handler => {
        subscriptionId = scrollX.current.addListener(handler);
      },
      () => scrollX.current.removeListener(subscriptionId)
    )
      .pipe(
        startWith({ value: initialOffsetX }),
        tap(({ value }) => {
          if (value >= windowWidth * (length + 1)) {
            scrollTo(windowWidth);
          }
          if (value <= 0) {
            scrollTo(windowWidth * length);
          }
        }),
        switchMap(({ value }) =>
          timer(autoplayNextDuration).pipe(
            map(() => Math.ceil(value / windowWidth) + 1)
          )
        )
      )
      .subscribe(index => {
        if (autoplay) {
          scrollTo(windowWidth * index, true);
        }
      });

    scrollTo(initialOffsetX);

    return () => subscription.unsubscribe();
  }, [windowWidth, scrollTo, length, autoplay, autoplayNextDuration]);

  return (
    <View style={styles.scrollContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal={true}
        pagingEnabled
        onScroll={onScroll}
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
      >
        {items.map((item, index) =>
          onItemRender({ item, index, style: { width: windowWidth } })
        )}
      </ScrollView>
      <View style={styles.indicatorContainer}>
        {items.map((_item, index) => {
          if (index === 0 || index === items.length - 1) {
            return null;
          }
          const imageIndex = index;
          const width = scrollX.current.interpolate({
            inputRange: [
              windowWidth * (imageIndex - 1),
              windowWidth * imageIndex,
              windowWidth * (imageIndex + 1)
            ],
            outputRange: [8, 16, 8],
            extrapolate: 'clamp'
          });

          return (
            <Animated.View
              key={imageIndex}
              style={[
                styles.normalDot,
                { width, backgroundColor: indicatorColor }
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {},
  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4
  },
  indicatorContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
