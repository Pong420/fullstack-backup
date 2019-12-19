import React from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps
} from 'react-native';

interface TextInputProps extends Omit<RNTextInputProps, 'onChange'> {
  onChange?: (value: string) => void;
}

export function TextInput({ onChange, style, ...props }: TextInputProps) {
  return (
    <View>
      <RNTextInput
        {...props}
        style={{
          height: 40,
          borderWidth: 1,
          borderColor: '#ddd',
          padding: 10
        }}
        onChangeText={onChange}
      />
    </View>
  );
}
