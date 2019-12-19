import { ViewStyle } from 'react-native';

export * from './mixins';

export function composeStyle<T>(...args: ViewStyle[]) {
  return args.reduce((style, css) => ({ ...style, ...css }), {});
}
