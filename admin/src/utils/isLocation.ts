import { Location } from 'history';

export function isLocation(object?: any): object is Location {
  return (
    object !== null &&
    typeof object === 'object' &&
    object.hasOwnProperty('pathname') &&
    object.hasOwnProperty('search')
  );
}
