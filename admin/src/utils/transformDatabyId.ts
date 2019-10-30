import { AllowedNames } from '../typings';

export interface TransformDataById<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<O, PropertyKey>,
  O = I
> {
  byIds: Record<I[K], O>;
  ids: Array<I[K]>;
}

export function transformDatabyId<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<O, PropertyKey>,
  O = I
>(
  items: I[],
  key: K,
  middleware: (item: I) => O = item => item
): TransformDataById<I, K, O> {
  const ids: Array<I[K]> = [];
  const byIds = items.reduce(
    (result, item) => {
      const id = item[key];
      ids.push(id);
      result[id] = middleware(item);
      return result;
    },
    {} as Record<I[K], O>
  );

  return { byIds, ids };
}
