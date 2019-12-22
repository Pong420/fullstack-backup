import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useBoolean } from '@fullstack/common/hooks/useBoolean';
import { TextInput, TextInputProps } from './TextInput';
import { dimen } from '../styles';

interface Props extends TextInputProps {}

export function Password(props: Props) {
  const [secureTextEntry, , , toggle] = useBoolean(true);
  return (
    <TextInput
      {...props}
      secureTextEntry={secureTextEntry}
      textContentType="password"
      autoCompleteType="password"
      rightElement={
        <TouchableHighlight onPress={toggle} underlayColor="transparent">
          <View
            style={{
              ...dimen(30),
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Feather
              name={secureTextEntry ? 'eye-off' : 'eye'}
              onPress={toggle}
              size={18}
            />
          </View>
        </TouchableHighlight>
      }
    />
  );
}
