import { combineReducers } from 'redux';

import language from './language';
import flights from './flights';

import { ReduxState } from '../../types';

const appReducer = combineReducers<ReduxState>({
  language,
  flights
});

export default appReducer;
