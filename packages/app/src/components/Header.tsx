import React, { ReactNode } from 'react';
import {
  TouchableNativeFeedback,
  StyleSheet,
  View,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationOptions } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { SemiBold } from './Text';

export interface HeaderProps {
  title: ReactNode;
}

export const headerScreenOptions: StackNavigationOptions = {
  header: ({ scene }) => {
    const { options } = scene.descriptor;
    const title = options.title || 'Go Back';
    return <Header title={title} />;
  }
};

const iconSize = 32;
export function Header({ title }: HeaderProps) {
  const { goBack } = useNavigation();
  return (
    <SafeAreaView style={styles.header}>
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
  header: { backgroundColor: '#fff' },
  goBack: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 20,
    paddingHorizontal: 15,
    alignSelf: 'flex-start'
  },
  text: {
    lineHeight: iconSize - 2
  }
});
