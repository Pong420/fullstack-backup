import { useSelector } from 'react-redux';
import { usePagination, UsePaginationOptions } from './usePagination';
import { PaginationSelectorReturnType, RootState } from '../store';

interface ReduxPaginationProps<T>
  extends Omit<UsePaginationOptions<T>, 'pageSize' | 'defer' | 'pageNo'> {
  selector: (state: RootState) => PaginationSelectorReturnType<T>;
}

export function useReduxPagination<T>({
  selector,
  ...props
}: ReduxPaginationProps<T>) {
  const { data, total, pageNo, defer, pageSize } = useSelector(selector);

  const [{ loading }] = usePagination<T>({
    ...props,
    defer,
    pageSize,
    pageNo
  });

  return { data, total, pageNo, loading };
}
