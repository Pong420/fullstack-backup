import qs from 'qs';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  createUseCRUDReducer,
  AllowedNames,
  CRUDState
} from '@fullstack/common/hooks';
import {
  usePagination,
  PaginateAsyncRequst,
  UsePaginationOptions
} from './usePagination';

interface Props<I extends {}>
  extends Omit<Partial<UsePaginationOptions<I>>, 'onSuccess'> {}

export function paginationSelector<State extends CRUDState<any>>({
  list,
  ids: _ids,
  pageNo,
  pageSize,
  params,
  total
}: State) {
  const start = (pageNo - 1) * pageSize;
  const data = list.slice(start, start + pageSize);
  const ids = _ids.slice(start, start + pageSize);

  let hasData = !!data.length;
  for (const item of data) {
    if (Object.keys(item).length === 0) {
      hasData = false;
      break;
    }
  }

  return { data, ids, pageNo, params, pageSize, total, hasData };
}

export function createUsePaginationLocal<
  I extends {},
  K extends AllowedNames<I, string>
>(key: K, request: PaginateAsyncRequst<I>) {
  const useCRUDReducer = createUseCRUDReducer<I, K>(key);

  return function usePaginationLocal(options: Props<I>) {
    const [state, actions] = useCRUDReducer();
    const { search } = useLocation();

    useEffect(() => {
      actions.params(qs.parse(search.slice(1)));
    }, [actions, search]);

    const payload = paginationSelector(state);

    const { loading, pagination, fetch } = usePagination(request, {
      ...options,
      ...payload,
      onSuccess: actions.paginate
    });

    return { ...payload, fetch, actions, loading, pagination };
  };
}
