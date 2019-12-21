import paths from '../paths.json';

// https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
type UnionToIntersection<U> = (U extends any // eslint-disable-line
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never;

export const SERVICE_PATHS = paths;

type Category = Exclude<keyof typeof paths, 'BASE_URL'>;
type AllKeys = keyof UnionToIntersection<typeof paths[Category]>;

const keys = Object.keys(paths).slice(1) as Array<Category>;

export const PATHS = keys.reduce(
  (acc, key) => {
    // type Prefix = typeof ;
    const paths_ = paths[key];
    const prefix = paths_.PREFIX;
    for (const pathKey_ in paths_) {
      const pathKey = pathKey_ as keyof typeof paths_;
      if (pathKey !== 'PREFIX') {
        acc[pathKey] = prefix + paths_[pathKey];
      }
    }
    return acc;
  },
  {} as Record<AllKeys, string>
);
