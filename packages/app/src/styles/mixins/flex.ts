import { ViewStyle } from 'react-native';

interface FlexOptions
  extends Pick<
    ViewStyle,
    'flex' | 'alignItems' | 'justifyContent' | 'flexDirection' | 'flexWrap'
  > {
  inline?: boolean;
}

export function flex({
  flex = 1,
  alignItems = 'stretch',
  justifyContent = 'flex-start',
  flexWrap = 'wrap',
  flexDirection = 'column'
}: FlexOptions = {}): ViewStyle {
  return {
    flex,
    alignItems,
    flexDirection,
    flexWrap,
    justifyContent
  };
}
