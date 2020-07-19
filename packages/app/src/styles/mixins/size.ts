import { ViewStyle } from 'react-native';

type Size = ViewStyle['width'] | ViewStyle['height'];

export function dimen(width: Size, height?: Size) {
  return {
    width,
    height: height || width
  };
}

export function paddingX(value: ViewStyle['padding']): ViewStyle {
  return {
    paddingLeft: value,
    paddingRight: value
  };
}

export function paddingY(value: ViewStyle['padding']): ViewStyle {
  return {
    paddingTop: value,
    paddingBottom: value
  };
}

export function marginX(value: ViewStyle['margin']): ViewStyle {
  return {
    marginLeft: value,
    marginRight: value
  };
}

export function marginY(value: ViewStyle['margin']): ViewStyle {
  return {
    marginTop: value,
    marginBottom: value
  };
}
