import React, { ReactNode } from 'react';
import {
  TouchableNativeFeedback,
  StyleSheet,
  View,
  ViewProps,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationOptions } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { SemiBold } from './Text';

export interface HeaderProps extends Pick<ViewProps, 'onLayout'> {
  title: ReactNode;
}

export const headerScreenOptions: StackNavigationOptions = {
  header: ({ scene }) => {
    const { options } = scene.descriptor;
    const title =
      options.headerTitle !== undefined
        ? options.headerTitle
        : options.title !== undefined
        ? options.title
        : scene.route.name;
    return <Header title={title} />;
  }
};

const iconSize = 32;
export function Header({ title, onLayout }: HeaderProps) {
  const { goBack } = useNavigation();
  return (
    <SafeAreaView style={styles.container} onLayout={onLayout}>
      <TouchableNativeFeedback onPress={goBack}>
        <View style={styles.goBack}>
          <Feather name="chevron-left" size={iconSize} />
          <SemiBold fontSize={16} style={styles.text}>
            {title}
          </SemiBold>
        </View>
      </TouchableNativeFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  goBack: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 15
  },
  text: {
    marginLeft: 10,
    lineHeight: iconSize
  }
});
