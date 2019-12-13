import { Schema$ResponsiveImage } from '.';

export function isResponsesiveImage(obj: any): obj is Schema$ResponsiveImage {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.hasOwnProperty('origin') &&
    obj.hasOwnProperty('small') &&
    obj.hasOwnProperty('medium') &&
    obj.hasOwnProperty('large')
  );
}
