import { ViewStyle } from 'react-native';
import { containerPadding } from './constants';
import { shadow } from './shadow';

export const card: ViewStyle = {
  flex: 1,
  borderRadius: 3,
  backgroundColor: '#fff',
  marginBottom: containerPadding,
  padding: containerPadding,
  ...shadow(2, { shadowRadius: 2.72 })
};
