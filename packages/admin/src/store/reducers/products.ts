import { ProductActionTypes, ProductActions } from '../actions';
import { Schema$Product } from '../../typings';
import { createCRUDReducerEx, CRUDStateEx } from '../redux-crud-ex';
import { LocationChangeAction, LOCATION_CHANGE } from 'connected-react-router';

const pageSize = 12;

interface Suggestion {
  values: string[];
  count: Record<string, number>;
  loaded: boolean;
}

interface State extends CRUDStateEx<Schema$Product, 'id'> {
  types: Suggestion;
  tags: Suggestion;
}

const [crudInitialState, crudReducer] = createCRUDReducerEx<
  Schema$Product,
  'id'
>({
  key: 'id',
  pageSize,
  actions: ProductActionTypes
});

const fill = crudInitialState.pageNo * pageSize;

const placesholders = {
  ids: new Array(fill).fill(null),
  list: new Array(fill).fill({})
};

const initialState: State = {
  ...crudInitialState,
  ...placesholders,
  types: {
    values: [],
    count: {},
    loaded: false
  },
  tags: {
    values: [],
    count: {},
    loaded: false
  }
};

function handleAddSuggestion(target: Suggestion, values: string[]) {
  const clone = { ...target };
  values.forEach(value => {
    !clone.values.includes(value) && clone.values.unshift(value);
    clone.count[value] = clone.count[value] ? clone.count[value] + 1 : 1;
  });
  return clone;
}

function handleDeleteSuggestion(target: Suggestion, values: string[]) {
  const clone = { ...target };
  values.forEach(value => {
    clone.count[value] = Math.max(0, clone.count[value] - 1);
    if (clone.count[value] === 0) {
      const index = clone.values.indexOf(value);
      clone.values = [
        ...clone.values.slice(0, index),
        ...clone.values.slice(index + 1)
      ];
    }
  });
  return clone;
}

export default function(
  state = initialState,
  action: ProductActions | LocationChangeAction
): State {
  let tags: string[] = [];
  let types: string[] = [];

  switch (action.type) {
    case ProductActionTypes.UPDATE_SUGGESSTION:
      return (() => {
        const { type, values } = action.payload;
        const changes = values.reduce(
          (acc, { total, value }) => {
            acc[type].values.push(value);
            acc[type].count[value] = total;
            return acc;
          },
          { ...{ tags: state.tags, types: state.types } }
        );
        changes[type].loaded = true;
        return {
          ...state,
          ...changes
        };
      })();

    case ProductActionTypes.CREATE:
    case ProductActionTypes.UPDATE:
      if (action.payload.tags) {
        tags = action.payload.tags;
      }

      if (action.payload.type) {
        types = [action.payload.type];
      }

    // eslint-disable: eslint(no-fallthrough)
    case ProductActionTypes.DELETE:
      const product = state.byIds[action.payload.id];

      return {
        ...state,
        ...crudReducer(state, action),
        tags: handleDeleteSuggestion(
          handleAddSuggestion(state.tags, tags),
          product ? product.tags : []
        ),
        types: handleDeleteSuggestion(handleAddSuggestion(state.types, types), [
          product ? product.type : ''
        ])
      };

    case ProductActionTypes.RESET:
      return { ...initialState };

    case LOCATION_CHANGE:
      return {
        ...state,
        ...crudReducer(state, action),
        ...placesholders
      };

    default:
      return { ...state, ...crudReducer(state, action) };
  }
}
