import React from 'react';
import {
  TouchableHighlight,
  TouchableHighlightProps,
  View,
  ActivityIndicator,
  ViewStyle
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from './Text';
import { paddingX } from '../styles';

export interface ButtonProps extends TouchableHighlightProps {
  intent?: keyof typeof themes;
  title?: string;
  loading?: boolean;
  ghost?: boolean;
  style?: ViewStyle;
}

const themes = {
  NONE: {
    gradient: ['hsla(0,0%,100%,.8)', 'hsla(0,0%,100%,0)'],
    textColor: '#182026',
    shadowColor: 'rgba(16,22,26,.3)',
    backgroundColor: '#f5f8fa'
  },
  PRIMARY: {
    gradient: ['hsla(0,0%,100%,.1)', 'hsla(0,0%,100%,0)'],
    textColor: '#fff',
    shadowColor: 'rgba(16,22,26,1)',
    backgroundColor: '#137cbd'
  },
  DARK: {
    gradient: ['hsla(0,0%,20%,.8)', 'hsla(0,0%,20%,0)'],
    textColor: '#fff',
    shadowColor: '#000',
    backgroundColor: '#182026'
  }
};

const LinearGradientWrapper: React.FC<{
  colors?: string[];
  style?: ViewStyle;
}> = ({ colors, ...props }) => {
  return colors ? (
    <LinearGradient colors={colors} {...props} />
  ) : (
    <View {...props} />
  );
};

export function Button({
  title,
  disabled,
  ghost,
  loading,
  intent = 'NONE',
  ...props
}: ButtonProps) {
  const theme = themes[intent];
  const active = loading || disabled;

  return (
    <TouchableHighlight
      {...props}
      disabled={active}
      underlayColor={ghost ? '#ddd' : undefined}
    >
      <View
        style={{
          borderWidth: 1,
          borderColor: intent === 'NONE' ? '#ddd' : theme.backgroundColor,
          ...(!ghost && {
            backgroundColor: active ? undefined : theme.backgroundColor,
            shadowColor: theme.shadowColor,
            shadowOffset: {
              width: 0,
              height: 0.25
            },
            shadowOpacity: 0.5,
            shadowRadius: 1,
            elevation: 1
          })
        }}
      >
        <LinearGradientWrapper
          colors={active || ghost ? undefined : theme.gradient}
          style={{
            ...paddingX(15),
            alignItems: 'center',
            justifyContent: 'center',
            height: 44
          }}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text
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
            </Text>
          )}
        </LinearGradientWrapper>
      </View>
    </TouchableHighlight>
  );
}
