import PATHS from './paths.json';
import { generatePath } from './generatePath';

// https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
type UnionToIntersection<U> = (
  U extends any // eslint-disable-line
    ? (k: U) => void
    : never
) extends (k: infer I) => void
  ? I
  : never;

declare global {
  interface String {
    // eslint-disable-next-line
    generatePath(params?: object): string;
  }
}

type Category = Exclude<keyof typeof PATHS, 'base_url'>;
type AllKeys = keyof UnionToIntersection<typeof PATHS[Category]>;

const category = Object.keys(PATHS).slice(1) as Array<Category>;
export const paths = {
  ...PATHS,
  ...category.reduce((acc, key) => {
    const paths = PATHS[key];
    const prefix = paths.prefix;
    for (const key in paths) {
      if (key !== 'prefix') {
        acc[key] = prefix + paths[key];
      }
    }
    return acc;
  }, {} as Record<AllKeys, string>)
};

String.prototype.generatePath = function (params) {
  return generatePath(this.toString(), params);
};
