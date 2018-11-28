export interface ITabConfig {
  name: string;
  component: React.ComponentClass;
}

export type LanguageType = 'ru' | 'en';
export type AirportCode = 's9600216' | 's9600215' | 's9600213';
export interface Action {
  type?: string;
  types?: Array<string>;
  data?: any;
  error?: any | null;
  [key: string]: any;
}

export interface ReduxState {
  language: ILanguage.State;
  airport: IAirport.State;
}

export namespace ILanguage {
  export interface State {
    selectedLanguage: LanguageType;
    dictionary: { [key: string]: string };
  }

  export type AC_Select = (value: LanguageType) => Action;
}

export namespace IAirport {
  export interface State {
    selectedAirport: AirportCode;
    isFetching: boolean;
    isFetched: boolean;
    arrivals: Array<any>;
    error: Error | null;
  }

  export type AC_Select = (value: AirportCode) => Action;
}
