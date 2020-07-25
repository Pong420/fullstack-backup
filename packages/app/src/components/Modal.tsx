import React, { ReactNode } from 'react';
import { TouchableNativeFeedback, StyleSheet, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { SemiBold } from './Text';

export interface ModalHeaderProps {
  title: ReactNode;
}

export interface ModalProps extends ModalHeaderProps {
  children?: ReactNode;
}

const iconSize = 22;
export function ModalHeader({ title }: ModalHeaderProps) {
  const { goBack } = useNavigation();
  const { top } = useSafeArea();
  return (
    <View style={{ marginTop: top }}>
      <TouchableNativeFeedback onPress={goBack}>
        <View style={styles.goBack}>
          <SemiBold fontSize={16} style={styles.text}>
            {title}
          </SemiBold>
          <Feather name="x" size={iconSize} />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

export function Modal({ title, children }: ModalProps) {
  return (
    <View style={styles.container}>
      <ModalHeader title={title} />
      {children}
    </View>
  );
}

const containerPadding = 24;
const styles = StyleSheet.create({
  container: { flex: 1 },
  goBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingHorizontal: containerPadding
  },
  text: {
    lineHeight: iconSize
  }
});
