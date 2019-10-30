import { UserActions, UserActionTypes } from '../actions/user';
import { Schema$User } from '../../typings';
import {
  transformDatabyId,
  TransformDataById
} from '../../utils/transformDatabyId';

interface State extends TransformDataById<Schema$User, 'username'> {
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
        const { byIds, ids } = transformDatabyId(payload, 'username');
        return {
          ...state,
          ids: [...state.ids, ...ids],
          list: [...state.list, ...payload],
          byIds: { ...state.byIds, ...byIds }
        };
      })();

    case UserActionTypes.REMOVE:
      return (() => {
        const { username } = action.payload;
        const index = state.ids.indexOf(username);

        const { [username]: deleted, ...byIds } = state.byIds;
        return {
          ...state,
          ids: [...state.ids.slice(0, index), ...state.ids.slice(index - 1)],
          list: [...state.list.slice(0, index), ...state.list.slice(index - 1)],
          byIds
        };
      })();

    case UserActionTypes.UPDATE:
      return (() => {
        const { username } = action.payload;
        return {
          ...state,
          byIds: {
            ...state.byIds,
            [username]: {
              ...state.byIds[username],
              ...action.payload
            }
          }
        };
      })();

    default:
      return state;
  }
}
