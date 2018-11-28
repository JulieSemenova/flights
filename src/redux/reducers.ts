import { combineReducers } from 'redux';

import language from './language';
import { ReduxState } from '../types';

const appReducer = combineReducers<ReduxState>({
  language
});

export default appReducer;
