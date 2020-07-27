import React, { ReactNode } from 'react';
import { TouchableNativeFeedback, StyleSheet, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { SemiBold } from './Text';

export interface ModalHeaderProps {
  title: ReactNode;
  onClose?: () => void;
}

export interface ModalProps extends ModalHeaderProps {
  children?: ReactNode;
}

const iconSize = 22;
export function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <View>
      <View style={styles.goBack}>
        <SemiBold fontSize={16} style={styles.text}>
          {title}
        </SemiBold>
        <TouchableNativeFeedback onPress={onClose}>
          <Feather name="x" size={iconSize} />
        </TouchableNativeFeedback>
      </View>
    </View>
  );
}

export function PageModal({ title, children, onClose }: ModalProps) {
  // Not sure the reason,
  // `SafeAreaView` delay the slide up animation of modal button
  // So `useSafeArea` instead
  const insets = useSafeArea();
  return (
    <View style={{ ...styles.container, paddingTop: insets.top }}>
      <ModalHeader title={title} onClose={onClose} />
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
