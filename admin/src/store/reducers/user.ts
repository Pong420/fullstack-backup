import { UserActions, UserActionTypes } from '../actions/user';
import { Schema$User } from '../../typings';
import {
  transformDatabyId,
  TransformDataById
} from '../../utils/transformDatabyId';

interface State extends TransformDataById<Schema$User, 'id'> {
  list: Schema$User[];
}

const initialState: State = {
  ids: [],
  list: [],
  byIds: {}
};

export default function(state = initialState, action: UserActions): State {
  switch (action.type) {
    case UserActionTypes.RESET:
      return initialState;

    case UserActionTypes.ADD:
      return (() => {
        const payload = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
        const { byIds, ids } = transformDatabyId(payload, 'id');
        return {
          ...state,
          ids: [...state.ids, ...ids],
          list: [...state.list, ...payload],
          byIds: { ...state.byIds, ...byIds }
        };
      })();

    case UserActionTypes.REMOVE:
      return (() => {
        const { id } = action.payload;
        const index = state.ids.indexOf(id);

        const { [id]: deleted, ...byIds } = state.byIds;
        return {
          ...state,
          ids: [...state.ids.slice(0, index), ...state.ids.slice(index + 1)],
          list: [...state.list.slice(0, index), ...state.list.slice(index + 1)],
          byIds
        };
      })();

    case UserActionTypes.UPDATE:
      return (() => {
        const { id } = action.payload;
        const index = state.ids.indexOf(id);
        const newUser = {
          ...state.byIds[id],
          ...action.payload
        };
        return {
          ...state,
          byIds: {
            ...state.byIds,
            [id]: newUser
          },
          list: [
            ...state.list.slice(0, index),
            newUser,
            ...state.list.slice(index + 1)
          ]
        };
      })();

    default:
      return state;
  }
}
