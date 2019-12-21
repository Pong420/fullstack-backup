import React from 'react';
import { TextInput, TextInputProps } from './TextInput';
import { Button } from './Button';
import { useBoolean } from '../hooks/useBoolean';

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
        <Button onPress={toggle} title={secureTextEntry ? 'V' : 'H'}></Button>
      }
    />
  );
}
