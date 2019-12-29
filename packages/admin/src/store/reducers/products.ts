import { createCRUDReducer, CRUDState } from '@pong420/redux-crud';
import { ProductActionTypes, ProductActions } from '../actions/products';
import { Schema$Product } from '../../typings';
import { ProductSuggestTypes } from '../../service';

const pageSize = 12;

interface Suggestion {
  values: string[];
  count: Record<string, number>;
  loaded: boolean;
}

interface State extends CRUDState<Schema$Product, 'id'> {
  [ProductSuggestTypes.CATEGORY]: Suggestion;
  [ProductSuggestTypes.TAG]: Suggestion;
}

const placesholders = {
  ids: new Array(pageSize).fill(null),
  list: new Array(pageSize).fill({})
};

const [crudInitialState, crudReducer] = createCRUDReducer<Schema$Product, 'id'>(
  {
    key: 'id',
    pageSize,
    actions: ProductActionTypes,
    ...placesholders
  }
);

const initialState: State = {
  ...crudInitialState,
  category: {
    values: [],
    count: {},
    loaded: false
  },
  tag: {
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

export default function(state = initialState, action: ProductActions): State {
  let tag: string[] = [];
  let category: string[] = [];

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
          { ...{ tag: state.tag, category: state.tag } }
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
        tag = action.payload.tags;
      }

      if (action.payload.category) {
        category = [action.payload.category];
      }

    // eslint-disable: eslint(no-fallthrough)
    case ProductActionTypes.DELETE:
      const product = state.byIds[action.payload.id];

      return {
        ...state,
        ...crudReducer(state, action),
        tag: handleDeleteSuggestion(
          handleAddSuggestion(state.tag, tag),
          product ? product.tags : []
        ),
        category: handleDeleteSuggestion(
          handleAddSuggestion(state.category, category),
          [product ? product.category : '']
        )
      };

    default:
      return { ...state, ...crudReducer(state, action) };
  }
}
