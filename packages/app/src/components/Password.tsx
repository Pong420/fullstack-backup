import React from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TextInput, TextInputProps } from './TextInput';
import { useBoolean } from '../hooks/useBoolean';
import { dimen } from '../styles';

interface Props extends TextInputProps {
  visible?: boolean;
}

export function Password({ visible, ...props }: Props) {
  const [secureTextEntry, , , toggle] = useBoolean(!visible);
  return (
    <TextInput
      textContentType="password"
      autoCompleteType="password"
      secureTextEntry={secureTextEntry}
      rightElement={
        <TouchableHighlight onPress={toggle} underlayColor="transparent">
          <View style={styles.view}>
            <Feather
              name={secureTextEntry ? 'eye-off' : 'eye'}
              onPress={toggle}
              size={18}
            />
          </View>
        </TouchableHighlight>
      }
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  view: {
    ...dimen(30),
    alignItems: 'center',
    justifyContent: 'center'
  }
});
