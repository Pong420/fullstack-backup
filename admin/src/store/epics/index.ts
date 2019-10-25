import { combineEpics } from 'redux-observable';
import userEpics from './user';

export default combineEpics(...userEpics);
