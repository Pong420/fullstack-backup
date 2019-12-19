import { ViewStyle } from 'react-native';

type Size = ViewStyle['width'] | ViewStyle['height'];

export function dimen(width: Size, height?: Size) {
  return {
    width,
    height: height || width
  };
}
