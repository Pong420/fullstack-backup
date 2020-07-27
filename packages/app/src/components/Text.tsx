import React, { ReactNode } from 'react';
import {
  Text as RnText,
  TextProps as RnTextProps,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';

export const fonts = {
  // prettier-ignore
  'muli': require('../assets/font/muli.ttf'),
  'muli-bold': require('../assets/font/muli-bold.ttf'),
  'muli-semi-bold': require('../assets/font/muli-semi-bold.ttf'),
  'ink-painting': require('../assets/font/ink-painting.ttf')
};

export type FontFamily = keyof typeof fonts;

type FontStyle = {
  fontFamily?: FontFamily;
};

export interface TextProps extends RnTextProps, FontStyle {
  fontSize?: number;
  style?: TextStyle & FontStyle;
  children?: ReactNode;
  color?: TextStyle['color'];
}

function createText(fontFamily: FontFamily) {
  return function Text({
    style,
    fontSize = 16,
    color = '#182026',
    ...props
  }: TextProps) {
    return (
      <RnText {...props} style={{ fontFamily, fontSize, color, ...style }} />
    );
  };
}

export const Text = createText('muli');
export const Bold = createText('muli-bold');
export const SemiBold = createText('muli-semi-bold');
export const InkPainting = createText('ink-painting');

const textWrapViewStyle: ViewStyle = { flexDirection: 'row' };
const textWrapStyle: ViewStyle = { flex: 1, flexWrap: 'wrap' };
export function TextWrap(props: TextProps) {
  return (
    <View style={textWrapViewStyle}>
      <Text {...props} style={textWrapStyle} />
    </View>
  );
}
