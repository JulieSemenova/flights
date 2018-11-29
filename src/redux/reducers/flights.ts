import axios from 'axios';
import { Dispatch } from 'redux';

import {
  Action,
  IFlights,
  AirportCode,
  EventType,
  ISOString,
  LanguageType
} from '../../types';
import { API_KEY, LANG_MAP } from '../../constants';

export const SELECT_AIRPORT: string = 'airport/SELECT_AIRPORT';
export const FETCH_FLIGHTS: string = 'airport/FETCH_FLIGHTS';
export const FETCH_FLIGHTS_SUCCESS: string = 'airport/FETCH_FLIGHTS_SUCCESS';
export const FETCH_FLIGHTS_FAIL: string = 'airport/FETCH_FLIGHTS_FAIL';

export const initialState: IFlights.State = {
  selectedAirport: 's9600216',
  isFetching: false,
  isFetched: false,
  arrivals: [],
  departures: [],
  delays: [],
  error: null
};

export default function reducer(
  state: IFlights.State = initialState,
  action: Action = {}
): IFlights.State {
  switch (action.type) {
    case SELECT_AIRPORT: {
      return {
        ...state,
        selectedAirport: action.data
      };
    }
    case FETCH_FLIGHTS:
      return {
        ...state,
        isFetching: true
      };
    case FETCH_FLIGHTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        [action.event]: action.data
      };
    case FETCH_FLIGHTS_FAIL:
      return {
        ...state,
        isFetching: false,
        isFetched: false,
        error: action.error
      };
    default:
      return state;
  }
}

export const selectAirport: IFlights.AC_Select = (data: AirportCode): Action => {
  return {
    data,
    type: SELECT_AIRPORT
  };
};

export const fetchingFlights: any = (): Action => {
  return {
    type: FETCH_FLIGHTS
  };
};

export const fetchFlights: IFlights.AC_Fetch = (
  airport: AirportCode,
  lang: LanguageType,
  event: EventType,
  date?: ISOString
): any => {
  const selectedDate = date ? date : new Date().toISOString();

  return function(dispatch: Dispatch) {
    dispatch(fetchingFlights());
    axios
      .get(
        `/schedule/?apikey=${API_KEY}&station=${airport}&transport_types=plane&event=${event}&date=${selectedDate}&lang=${
          LANG_MAP[lang]
        }`
      )
      .then(response => dispatch(fetchFlightsSuccess(response, event)))
      .catch(error => dispatch(fetchFlightsError(error)));
  };
};

export const fetchFlightsSuccess: any = (data: any, event: EventType): Action => {
  return {
    event,
    data: data.data.schedule.map((flight: any) => {
      return {
        arrival: flight.arrival,
        departure: flight.departure,
        is_fuzzy: flight.is_fuzzy,
        thread: {
          title: flight.thread.title,
          number: flight.thread.number,
          uid: flight.thread.uid,
          vehicle: flight.thread.vehicle,
          carrier: flight.thread.carrier.title
        }
      };
    }),
    type: FETCH_FLIGHTS_SUCCESS
  };
};

export const fetchFlightsError: any = (error: AirportCode): Action => {
  return {
    error,
    type: FETCH_FLIGHTS_FAIL
  };
};
