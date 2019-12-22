import {
  NavigationActions,
  NavigationContainerComponent,
  NavigationNavigateActionPayload
} from 'react-navigation';
import { Screens } from '../constants';

let _navigator: NavigationContainerComponent | null;

export function setTopLevelNavigator(
  navigatorRef: NavigationContainerComponent | null
) {
  _navigator = navigatorRef;
}

export function navigate(
  payload: NavigationNavigateActionPayload & { routeName: Screens }
) {
  if (_navigator) {
    _navigator.dispatch(NavigationActions.navigate(payload));
  } else if (__DEV__) {
    console.warn('_navigator is not defined');
  }
}
