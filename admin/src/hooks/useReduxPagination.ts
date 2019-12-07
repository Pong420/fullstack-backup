import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { usePagination, UsePaginationOptions } from './usePagination';
import { PaginationSelectorReturnType, RootState } from '../store';

interface ReduxPaginationProps<T> extends UsePaginationOptions<T> {
  selector: (state: RootState) => PaginationSelectorReturnType<T>;
}

export function useReduxPagination<T>({
  selector,
  ...props
}: ReduxPaginationProps<T>) {
  const { data, total, pageNo, shouldFetch } = useSelector(selector);

  const [{ loading, run }] = usePagination<T>({
    ...props,
    defer: true,
    pageNo
  });

  useEffect(() => {
    shouldFetch && run();
  }, [shouldFetch, run]);

  return { data, total, pageNo, loading } as const;
}
