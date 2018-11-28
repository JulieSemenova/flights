import { Action, Language } from '../types';
import dictionaryMock from './dictionaryMock';

export const SELECT_LANGUAGE: string = 'error/SELECT_LANGUAGE';

export const initialState: Language.State = {
  selectedLanguage: 'ru',
  dictionary: {
    arrivals: 'прилеты',
    departures: 'вылеты',
    delays: 'задержки'
  }
};

export default function reducer(
  state: Language.State = initialState,
  action: Action = {}
): Language.State {
  switch (action.type) {
    case SELECT_LANGUAGE: {
      return {
        ...state,
        selectedLanguage: action.data,
        dictionary: dictionaryMock[action.data]
      };
    }
    default:
      return state;
  }
}

export const selectLanguage: Language.AC_Select = (data: Language): Action => {
  return {
    data,
    type: SELECT_LANGUAGE
  };
};
