import { useMemo, useCallback } from 'react';
import { AllowedNames, paginationSelector } from '@pong420/redux-crud';
import {
  usePagination,
  UsePaginationProps,
  PaginationPayload
} from './usePagination';
import { useCRUDReducer } from './useCRUDReducer';

export type onSuceess<I> = (payload: PaginationPayload<I>) => void;

interface Props<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
> extends Pick<UsePaginationProps<I>, 'fn' | 'onFailure'> {
  key: K;
  pageSize?: number;
  cache?: boolean;
  onSuccess?: onSuceess<I>;
}

const defaultPageSize = 5;
const list = new Array(defaultPageSize).fill({});
const ids = new Array(defaultPageSize).fill(null);

export function usePaginationLocal<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey> = AllowedNames<I, PropertyKey>
>({ key, pageSize = defaultPageSize, onSuccess, ...props }: Props<I, K>) {
  const [state, actions] = useCRUDReducer<I, K>({ key, list, ids, pageSize });
  const { hasData, ...payload } = useMemo(() => paginationSelector(state), [
    state
  ]);
  const { paginate } = actions;
  const onSuccessCallback = useCallback<onSuceess<I>>(
    payload => {
      paginate(payload);
      onSuccess && onSuccess(payload);
    },
    [paginate, onSuccess]
  );

  const { loading, pagination, run } = usePagination({
    ...props,
    ...payload,
    pageSize,
    hasData,
    onSuccess: onSuccessCallback
  });

  return { ...payload, run, actions, loading, pagination };
}
