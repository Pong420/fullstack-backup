import React from 'react';
import {
  Text as RnText,
  TextProps as RnTextProps,
  TextStyle
} from 'react-native';

export const fonts = {
  // prettier-ignore
  'muli': require('../assets/font/muli.ttf'),
  'ink-painting': require('../assets/font/ink-painting.ttf')
};

export type FontFamily = keyof typeof fonts;

type FontStyle = {
  fontFamily?: FontFamily;
};

export interface TextProps extends RnTextProps, FontStyle {
  fontSize?: number;
  style?: TextStyle & FontStyle;
  children?: string | number;
}

function createText(fontFamily: FontFamily) {
  return function Text({ style, fontSize = 16, ...props }: TextProps) {
    return <RnText {...props} style={{ fontFamily, fontSize, ...style }} />;
  };
}

export const Text = createText('muli');
export const InkPainting = createText('ink-painting');
