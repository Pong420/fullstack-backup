import React, { ReactElement } from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  ViewStyle,
  Keyboard
} from 'react-native';
import { useBoolean } from '../hooks/useBoolean';

export interface TextInputProps extends Omit<RNTextInputProps, 'onChange'> {
  onChange?: (value: string) => void;
  hasError?: boolean;
  intent?: keyof typeof themes;
  rightElement?: ReactElement<{ [x: string]: any; style: ViewStyle }>;
}

const themes = {
  PRIMARY: {
    dark: '#137cbd',
    light: 'rgba(19,124,189,.2)'
  },
  DANGER: {
    dark: '#db3737',
    light: 'rgba(219,55,55,.3)'
  }
};

const danger = themes['DANGER'];
const height = 40;

export function TextInput({
  onChange,
  style,
  hasError,
  intent = 'PRIMARY',
  rightElement,
  ...props
}: TextInputProps) {
  const [focused, onFocus, onBlur] = useBoolean();
  const theme = themes[hasError ? 'DANGER' : intent];

  return (
    <View
      style={{
        padding: 1,
        borderWidth: 1,
        borderRadius: 3,
        ...(focused && {
          borderColor: theme.light,
          shadowColor: theme.light
        }),
        ...(hasError && {
          borderColor: danger.light,
          shadowColor: danger.light
        }),
        ...(focused || hasError
          ? {
              shadowOpacity: 0.5,
              shadowRadius: 1,
              shadowOffset: {
                width: 0,
                height: 2
              },
              elevation: 1
            }
          : {
              borderColor: '#fff'
            })
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: hasError ? danger.dark : focused ? theme.dark : '#ddd'
        }}
      >
        <RNTextInput
          {...props}
          onBlur={onBlur}
          onFocus={onFocus}
          style={{
            flex: 1,
            padding: 10,
            height
          }}
          onChangeText={onChange}
          onSubmitEditing={Keyboard.dismiss}
        />
        <View style={{ padding: 5 }}>{rightElement}</View>
      </View>
    </View>
  );
}
