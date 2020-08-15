import React, { ReactElement, useRef } from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  ViewStyle,
  StyleSheet
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useBoolean } from '@/hooks/useBoolean';
import { shadow, colors } from '@/styles';

export interface TextInputProps extends Omit<RNTextInputProps, 'onChange'> {
  onChange?: (value: string) => void;
  hasError?: boolean;
  intent?: keyof typeof themes;
  leftIcon?: string;
  leftElement?: ReactElement<{ [x: string]: any; style: ViewStyle }>;
  rightElement?: ReactElement<{ [x: string]: any; style: ViewStyle }>;
  border?: 'bottom' | 'default' | 'none';
}

const themes = {
  PRIMARY: {
    dark: colors.blue,
    light: 'rgba(19,124,189,.2)'
  },
  DANGER: {
    dark: colors.red,
    light: 'rgba(219,55,55,.3)'
  }
};

const height = 40;

export type ControlRef<T> = {
  [K in keyof T]?: RNTextInput | null;
};

export function useFocusNextHandler<T>() {
  const { current: controlRefs } = useRef<ControlRef<T>>({});
  return {
    controlRefs,
    refProps: (name: keyof T) => (input: RNTextInput) => {
      controlRefs[name] = input;
    },
    focusNextProps: (key: keyof T): TextInputProps => ({
      returnKeyType: 'next',
      onSubmitEditing: () => controlRefs[key]?.focus()
    })
  };
}

export const TEXT_INPUT_ICON_SIZE = 20;

export { RNTextInput };
export type { RNTextInputProps };

export function createTextInput(defaultProps?: TextInputProps) {
  return React.forwardRef<RNTextInput, TextInputProps>((_props, ref) => {
    const {
      onChange,
      style,
      hasError,
      leftIcon,
      leftElement,
      rightElement,
      border = 'bottom',
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
        ? shadow(0, {
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
            paddingTop: 1,
            paddingHorizontal: border === 'default' ? 10 : 3,
            borderColor: hasError || focused ? theme.dark : colors.divider
          }}
        >
          {leftElement ||
            (leftIcon ? (
              <Feather
                name={leftIcon}
                size={TEXT_INPUT_ICON_SIZE}
                style={{
                  color: hasError || focused ? theme.dark : colors.black
                }}
              />
            ) : null)}
          <RNTextInput
            ref={ref}
            autoCapitalize="none"
            onBlur={onBlur}
            onFocus={onFocus}
            onChangeText={onChange}
            style={StyleSheet.compose(
              {
                height,
                flex: 1,
                paddingHorizontal: 7,
                color:
                  border === 'bottom' && (hasError || focused)
                    ? theme.dark
                    : colors.black
              },
              style
            )}
            {...props}
            {...(props &&
              typeof props.value === 'undefined' &&
              onChange && { value: '' })}
            placeholderTextColor={colors.textMuted}
          />
          {rightElement}
        </View>
      </View>
    );
  });
}

export const TextInput = createTextInput();
