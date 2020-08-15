import React, { useRef, useLayoutEffect, useState } from 'react';
import {
  View,
  SectionList,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { JSONParse } from '@fullstack/common/utils/JSONParse';
import { Text, SemiBold } from '@/components/Text';
import { colors } from '@/styles';
import AsyncStorage from '@react-native-community/async-storage';
import { useRxAsync } from 'use-rx-hooks';
import { removeFromArray } from '@/hooks/crud';

interface ItemProps extends TouchableOpacityProps {}

interface Props {
  currentValue?: string;
  onItemPress: (search: string) => void;
}

const RecentSearchesKey = 'recent searches';

async function getRecentSearches(): Promise<string[]> {
  const content = await AsyncStorage.getItem(RecentSearchesKey);
  return (content && JSONParse<string[]>(content)) || [];
}

export async function updateRecentSearches(search?: string): Promise<void> {
  const searches = await getRecentSearches();
  let result: string[] = [];

  if (typeof search === 'string') {
    result = removeFromArray(searches, searches.indexOf(search));
    result = [search, ...result];
  }

  await AsyncStorage.setItem(
    RecentSearchesKey,
    JSON.stringify(result.slice(0, 10))
  );
}

const Item: React.FC<ItemProps> = ({ children, ...props }) => {
  return (
    <TouchableOpacity {...props} style={styles.item}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );
};

function useAnimate() {
  const anim = useRef(new Animated.Value(0));

  useLayoutEffect(() => {
    Animated.spring(anim.current, {
      toValue: 1,
      bounciness: 0,
      useNativeDriver: true
    }).start();
  }, []);

  return [
    styles.container,
    {
      opacity: anim.current,
      transform: [
        {
          translateY: anim.current.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          })
        }
      ]
    }
  ];
}

export function RecentSearches({ currentValue, onItemPress }: Props) {
  const [data, setData] = useState<string[]>([]);

  const { current: onSuccess } = useRef((payload: string[]) => {
    setData(payload.filter(s => s !== currentValue));
  });

  const animStyle = useAnimate();

  useRxAsync(getRecentSearches, { onSuccess });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {data.length ? (
        <Animated.View style={animStyle}>
          <SectionList
            sections={[
              {
                title: 'Recent Search',
                data
              }
            ]}
            alwaysBounceVertical={false}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <Item onPress={() => onItemPress(item)}>{item}</Item>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.header}>
                <SemiBold>{title}</SemiBold>
                <TouchableOpacity onPress={() => updateRecentSearches()}>
                  <Text>clear all</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </Animated.View>
      ) : (
        <View style={styles.container} />
      )}
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10
  },
  header: {
    borderBottomWidth: 1,
    borderColor: colors.divider,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10
  },
  item: {
    height: 40,
    justifyContent: 'center',
    paddingLeft: 5
  },
  separator: {
    borderTopWidth: 1,
    borderColor: colors.divider
  }
});
