export interface ITabConfig {
  name: string;
  component: React.ComponentClass;
}

export type Language = 'ru' | 'en';

export interface Action {
  type?: string;
  types?: Array<string>;
  data?: any;
  error?: any | null;
  [key: string]: any;
}

export interface ReduxState {
  language: Language.State;
}

export namespace Language {
  export interface State {
    selectedLanguage: Language;
  }

  export type AC_Select = (value: Language) => Action;
}
