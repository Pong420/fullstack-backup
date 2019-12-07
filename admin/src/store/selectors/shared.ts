import { CRUDState } from '../createCRUDReducer';
import { AllowedNames } from '../../typings';

export type PaginationSelectorReturnType<T> = {
  data: Partial<T>[];
  pageNo: number;
  total: number;
  shouldFetch: boolean;
};

export function paginationSelector<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
>({ list, pageNo }: CRUDState<I, K>): PaginationSelectorReturnType<I> {
  const pageSize = 10;
  const start = (pageNo - 1) * pageSize;
  const data = list.slice(start, start + pageSize);

  let shouldFetch = !data.length;
  for (const item of data) {
    if (Object.keys(item).length === 0) {
      shouldFetch = true;
      break;
    }
  }

  return { data, pageNo, total: list.length, shouldFetch };
}
