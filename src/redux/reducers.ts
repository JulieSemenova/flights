import { combineReducers } from 'redux';

import language from './language';
import airport from './airport';

import { ReduxState } from '../types';

const appReducer = combineReducers<ReduxState>({
  language,
  airport
});

export default appReducer;
