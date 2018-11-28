import { Action, ILanguage, LanguageType } from '../types';
import dictionaryMock from './dictionaryMock';

export const SELECT_LANGUAGE: string = 'language/SELECT_LANGUAGE';

export const initialState: ILanguage.State = {
  selectedLanguage: 'ru',
  dictionary: {
    arrivals: 'прилеты',
    departures: 'вылеты',
    delays: 'задержки'
  }
};

export default function reducer(
  state: ILanguage.State = initialState,
  action: Action = {}
): ILanguage.State {
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

export const selectLanguage: ILanguage.AC_Select = (data: LanguageType): Action => {
  return {
    data,
    type: SELECT_LANGUAGE
  };
};
