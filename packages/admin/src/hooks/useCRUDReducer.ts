import qs, { IParseOptions } from 'qs';
import { useMemo, useReducer, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  createCRUDActions,
  createCRUDReducer,
  CreateCRUDReducerOptions,
  AllowedNames,
  parsePageNo
} from '@pong420/redux-crud';
import { bindDispatch } from './useActions';
import { history } from '../store';

const parseOptions: IParseOptions = {
  parseArrays: true
};

export interface UseCRUDReducerProps<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
> extends Omit<CreateCRUDReducerOptions<I, K, any>, 'actions'> {}

export function useCRUDReducer<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey> = AllowedNames<I, PropertyKey>
>({ key, ids, list, pageSize, onLocationChanged }: UseCRUDReducerProps<I, K>) {
  const location = useLocation();

  const { actionsCreators, initialState, reducer, init } = useMemo(() => {
    const [actionsCreators, actionTypes] = createCRUDActions<I, K>()({
      create: ['CREATE', 'CREATE'],
      update: ['UPDATE', 'UPDATE'],
      delete: ['DELETE', 'DELETE'],
      paginate: ['PAGINATE', 'PAGINATE']
    });

    const [initialState, reducer] = createCRUDReducer<I, K>({
      key,
      prefill: true,
      parseOptions,
      pageSize,
      actions: actionTypes,
      onLocationChanged,
      ids: ids || [],
      list: list || []
    });

    // Initialize params here instead of `createCRUDReducer`,
    // prevent error when dispatch 'RESET'
    function init(state: typeof initialState) {
      const { pageNo, ...params } = qs.parse(
        history.location.search.slice(1),
        parseOptions
      );
      return {
        ...state,
        params,
        pageNo: parsePageNo(pageNo) || state.pageNo
      };
    }

    return { actionsCreators, initialState, reducer, init };
  }, [key, ids, list, pageSize, onLocationChanged]);

  const [state, dispatch] = useReducer(reducer, initialState, init);

  const actions = useMemo(() => bindDispatch(actionsCreators, dispatch), [
    dispatch,
    actionsCreators
  ]);

  useEffect(() => {
    dispatch({
      type: '@@router/LOCATION_CHANGE',
      payload: {
        isFirstRendering: false,
        location,
        action: 'PUSH'
      }
    });
  }, [dispatch, location]);

  return [state, actions] as const;
}
