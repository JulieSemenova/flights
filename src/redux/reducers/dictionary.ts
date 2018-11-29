import { Action, IDictionary, LanguageType } from '../../types';
import dictionaryMock from '../dictionaryMock';

export const GET_DICTIONARY: string = 'language/GET_DICTIONARY';

export const initialState: IDictionary.State = {
  selectedLanguage: 'ru',
  dictionary: null
};

export default function reducer(
  state: IDictionary.State = initialState,
  action: Action = {}
): IDictionary.State {
  switch (action.type) {
    case GET_DICTIONARY: {
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

export const getDictionary: IDictionary.AC_GetDictionary = (
  data: LanguageType
): Action => {
  return {
    data,
    type: GET_DICTIONARY
  };
};
