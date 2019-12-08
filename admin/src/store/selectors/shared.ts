import { CRUDState } from '../createCRUDReducer';
import { AllowedNames } from '../../typings';

export type PaginationSelectorReturnType<T> = {
  data: CRUDState<T, any>['list'];
  pageNo: number;
  pageSize: number;
  total: number;
  defer: boolean;
};

export function paginationSelector<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
>({
  list,
  pageNo,
  pageSize
}: CRUDState<I, K>): PaginationSelectorReturnType<I> {
  const start = (pageNo - 1) * pageSize;
  const data = list.slice(start, start + pageSize);

  let defer = !!data.length;
  for (const item of data) {
    if (Object.keys(item).length === 0) {
      defer = false;
      break;
    }
  }

  return { data, pageNo, pageSize, total: list.length, defer };
}
