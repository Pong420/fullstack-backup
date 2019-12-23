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
    colors: ['hsla(0,0%,100%,.8)', 'hsla(0,0%,100%,0)'],
    underlayColor: '#d8e1e8',
    textColor: '#182026',
    shadowColor: '#182026',
    backgroundColor: '#f5f8fa',
    disabledBackgroundColor: 'rgba(206,217,224,.5)'
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
  const inActive = loading || disabled;

  return (
    <TouchableHighlight
      {...props}
      disabled={inActive}
      underlayColor={theme.underlayColor}
    >
      <View
        style={{
          ...(ghost
            ? {
                borderWidth: 1,
                borderColor: intent === 'NONE' ? '#ddd' : theme.backgroundColor
              }
            : {
                backgroundColor: inActive
                  ? theme.disabledBackgroundColor
                  : theme.backgroundColor
              }),
          ...(!ghost &&
            !inActive && {
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
          colors={inActive || ghost ? undefined : theme.colors}
          style={{
            ...paddingX(15),
            alignItems: 'center',
            justifyContent: 'center',
            height: 40
          }}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text
              style={{
                color:
                  ghost && intent !== 'NONE'
                    ? theme.backgroundColor
                    : theme.textColor,
                opacity: disabled ? 0.5 : 1
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
