import { UserActions, UserActionTypes } from '../actions/user';
import { createCRUDReducer, CRUDState } from '../createCRUDReducer';
import { Schema$User } from '../../typings';

interface State extends CRUDState<Schema$User, 'id'> {}

const { crudInitialState, crudReducer } = createCRUDReducer<Schema$User, 'id'>({
  key: 'id'
});

export default function(state = crudInitialState, action: UserActions): State {
  switch (action.type) {
    case UserActionTypes.RESET:
      return crudReducer(undefined, { type: 'RESET' });

    case UserActionTypes.CREATE:
      return crudReducer(state, { type: 'CREATE', payload: action.payload });

    case UserActionTypes.PAGINATE:
      return crudReducer(state, {
        type: 'PAGINATE',
        payload: action.payload
      });

    case UserActionTypes.SET_PAGE:
      return crudReducer(state, {
        type: 'SET_PAGE',
        payload: action.payload
      });

    case UserActionTypes.DELETE:
      return crudReducer(state, { type: 'DELETE', payload: action.payload });

    case UserActionTypes.UPDATE:
      return crudReducer(state, { type: 'UPDATE', payload: action.payload });

    default:
      return state;
  }
}
