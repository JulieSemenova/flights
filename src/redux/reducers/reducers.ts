import { combineReducers } from 'redux';

import dictionary from './dictionary';
import flights from './flights';

import { ReduxState } from '../../types';

const appReducer = combineReducers<ReduxState>({
  dictionary,
  flights
});

export default appReducer;
