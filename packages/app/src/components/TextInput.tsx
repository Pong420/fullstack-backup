import React, { ReactElement } from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  ViewStyle
} from 'react-native';
import { useBoolean } from '../hooks/useBoolean';
import { shadow } from '../styles';

export interface TextInputProps extends Omit<RNTextInputProps, 'onChange'> {
  onChange?: (value: string) => void;
  hasError?: boolean;
  intent?: keyof typeof themes;
  rightElement?: ReactElement<{ [x: string]: any; style: ViewStyle }>;
  border?: 'bottom' | 'default' | 'none';
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

const height = 40;

export function createTextInput(defaultProps?: TextInputProps) {
  return function TextInput(_props: TextInputProps) {
    const {
      onChange,
      style,
      hasError,
      rightElement,
      border = 'default',
      intent = 'PRIMARY',
      ...props
    } = { ...defaultProps, ..._props };
    const [focused, onFocus, onBlur] = useBoolean();
    const theme = themes[hasError ? 'DANGER' : intent];

    const defaultOuterStyle = {
      padding: 1,
      borderWidth: 1,
      borderRadius: 3,
      ...(focused || hasError
        ? shadow({
            shadowRadius: 1,
            shadowOffsetY: 2,
            shadowColor: theme.light,
            borderColor: theme.light
          })
        : { borderColor: '#fff' })
    };

    return (
      <View style={border === 'default' ? defaultOuterStyle : undefined}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            ...(border === 'default'
              ? { borderWidth: 1 }
              : border === 'bottom'
              ? { borderBottomWidth: 1 }
              : {}),
            borderColor: hasError || focused ? theme.dark : '#ddd'
          }}
        >
          <RNTextInput
            autoCapitalize="none"
            onBlur={onBlur}
            onFocus={onFocus}
            onChangeText={onChange}
            style={{
              height,
              flex: 1,
              padding: border === 'default' ? 10 : 3,
              color:
                border === 'bottom' && (hasError || focused)
                  ? theme.dark
                  : '#182026'
            }}
            {...props}
            {...(props &&
              typeof props.value === 'undefined' &&
              onChange && { value: '' })}
            placeholderTextColor="#8a9ba8"
          />
          {rightElement}
        </View>
      </View>
    );
  };
}

export const TextInput = createTextInput();
