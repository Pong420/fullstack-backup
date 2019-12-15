import { createCRUDReducerEx, CRUDStateEx } from '../redux-crud-ex';
import { ProductActionTypes, ProductActions } from '../actions';
import { Schema$Product } from '../../typings';

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

const { crudInitialStateEx, crudReducerEx } = createCRUDReducerEx<
  Schema$Product,
  'id'
>({
  key: 'id',
  actions: ProductActionTypes,
  pageSize
});

const fill = crudInitialStateEx.pageNo * pageSize;

const initialState: State = {
  ...crudInitialStateEx,
  ids: new Array(fill).fill(null),
  list: new Array(fill).fill({}),
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

export default function(state = initialState, action: ProductActions): State {
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
      return {
        ...state,
        ...crudReducerEx(state, action),
        tags: handleDeleteSuggestion(
          handleAddSuggestion(state.tags, tags),
          state.byIds[action.payload.id].tags
        ),
        types: handleDeleteSuggestion(handleAddSuggestion(state.types, types), [
          state.byIds[action.payload.id].type
        ])
      };

    default:
      return { ...state, ...crudReducerEx(state, action) };
  }
}
