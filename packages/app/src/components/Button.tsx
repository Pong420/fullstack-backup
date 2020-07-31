import React from 'react';
import {
  TouchableHighlight,
  TouchableHighlightProps,
  View,
  ActivityIndicator,
  ViewStyle,
  StyleSheet
} from 'react-native';
import { shadow, colors } from '@/styles';
import { SemiBold } from './Text';

export interface ButtonProps extends TouchableHighlightProps {
  intent?: keyof typeof themes;
  title?: string;
  loading?: boolean;
  ghost?: boolean;
  style?: ViewStyle;
}

const themes = {
  NONE: {
    textColor: colors.black,
    shadowColor: 'rgba(16,22,26,.3)',
    backgroundColor: '#f5f8fa',
    underlayColor: undefined,
    activeOpacity: undefined
  },
  PRIMARY: {
    textColor: '#fff',
    shadowColor: 'rgba(16,22,26,1)',
    backgroundColor: colors.blue,
    underlayColor: '#eee',
    activeOpacity: undefined
  },
  DARK: {
    textColor: '#fff',
    shadowColor: '#000',
    backgroundColor: colors.black,
    underlayColor: colors.divider,
    activeOpacity: 0.6
  }
};

export function Button({
  title,
  disabled,
  ghost,
  loading,
  intent = 'NONE',
  style,
  ...props
}: ButtonProps) {
  const theme = themes[intent];
  const active = loading || disabled;

  return (
    <TouchableHighlight
      {...props}
      disabled={active}
      underlayColor={ghost ? colors.divider : theme.underlayColor}
      activeOpacity={theme.activeOpacity}
      style={StyleSheet.compose(style, {
        borderWidth: 1,
        borderRadius: 3,
        borderColor: intent === 'NONE' ? colors.divider : theme.backgroundColor
      })}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 15,
          height: 44,
          ...(!ghost &&
            shadow(4, {
              backgroundColor: theme.backgroundColor,
              shadowColor: theme.shadowColor
            }))
        }}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <SemiBold
            style={{
              fontSize: 16,
              opacity: disabled ? 0.5 : 1,
              color:
                ghost && intent !== 'NONE'
                  ? theme.backgroundColor
                  : theme.textColor
            }}
          >
            {title}
          </SemiBold>
        )}
      </View>
    </TouchableHighlight>
  );
}
