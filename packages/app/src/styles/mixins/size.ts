import { ViewStyle } from 'react-native';

type Size = ViewStyle['width'] | ViewStyle['height'];

export function dimen(width: Size, height?: Size): ViewStyle {
  return {
    width,
    height: height || width
  };
}

interface ShadowOffset {
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

export function shadow({
  shadowOffsetX = 0,
  shadowOffsetY = 0,
  ...styles
}: ViewStyle & ShadowOffset): ViewStyle {
  return {
    shadowOffset: { width: shadowOffsetX, height: shadowOffsetY },
    shadowOpacity: 0.5,
    elevation: 1,
    shadowRadius: 1,
    ...styles
  };
}
