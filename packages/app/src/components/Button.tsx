import React from 'react';
import {
  TouchableHighlight,
  TouchableHighlightProps,
  View,
  ActivityIndicator,
  ViewStyle
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SemiBold } from './Text';
import { shadow } from '../styles';

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
      <LinearGradientWrapper
        colors={active || ghost ? undefined : theme.gradient}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 44,
          paddingHorizontal: 15,
          borderWidth: 1,
          borderColor: intent === 'NONE' ? '#ddd' : theme.backgroundColor,
          ...(!ghost &&
            shadow({
              backgroundColor: theme.backgroundColor,
              shadowColor: theme.shadowColor,
              shadowOffsetY: 0.25
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
      </LinearGradientWrapper>
    </TouchableHighlight>
  );
}
