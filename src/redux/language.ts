import { Action, Language } from '../types';

export const SELECT_LANGUAGE: string = 'error/SELECT_LANGUAGE';

export const initialState: Language.State = {
  selectedLanguage: 'ru'
};

export default function reducer(
  state: Language.State = initialState,
  action: Action = {}
): Language.State {
  switch (action.type) {
    case SELECT_LANGUAGE: {
      return {
        ...state,
        selectedLanguage: action.value
      };
    }

    default:
      return state;
  }
}

export const selectLanguage: Language.AC_Select = (value: Language): Action => {
  return {
    value,
    type: SELECT_LANGUAGE
  };
};
