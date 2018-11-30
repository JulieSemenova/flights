import axios from 'axios';
import { Dispatch } from 'redux';

import {
  Action,
  IFlights,
  AirportCode,
  EventType,
  LanguageType,
  ISOString
} from '../../types';
import { API_KEY, LANG_MAP, PAGE_SIZE } from '../../constants';

export const SELECT_AIRPORT: string = 'airport/SELECT_AIRPORT';
export const FETCH_FLIGHTS: string = 'airport/FETCH_FLIGHTS';
export const FETCH_FLIGHTS_SUCCESS: string = 'airport/FETCH_FLIGHTS_SUCCESS';
export const FETCH_DELAYS_SUCCESS: string = 'airport/FETCH_DELAYS_SUCCESS';
export const FETCH_FLIGHTS_FAIL: string = 'airport/FETCH_FLIGHTS_FAIL';

export const initialState: IFlights.State = {
  isFetching: false,
  isFetched: false,
  arrivals: {
    total: 0,
    flights: []
  },
  departures: {
    total: 0,
    flights: []
  },
  delays: {
    total: 0,
    flights: []
  },
  error: null
};

export default function reducer(
  state: IFlights.State = initialState,
  action: Action = {}
): IFlights.State {
  switch (action.type) {
    case FETCH_FLIGHTS:
      return {
        ...state,
        isFetching: true
      };
    case FETCH_FLIGHTS_SUCCESS:
      const flightEvent = action.event === 'arrival' ? 'arrivals' : 'departures';
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        [flightEvent]: action.data
      };
    case FETCH_DELAYS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        delays: action.data
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

export const fetchingFlights: any = (): Action => {
  return {
    type: FETCH_FLIGHTS
  };
};

export const fetchFlights: IFlights.AC_Fetch = (
  airport: AirportCode,
  lang: LanguageType,
  event: EventType,
  offset: number,
  date?: ISOString
): any => {
  const selectedDate = date ? date : new Date().toISOString();

  return function(dispatch: Dispatch) {
    dispatch(fetchingFlights());
    axios
      .get(
        `/schedule/?apikey=${API_KEY}&station=${airport}&transport_types=plane&event=${event}&date=${selectedDate}&offset=${offset}&limit=${PAGE_SIZE}&lang=${
          LANG_MAP[lang]
        }`
      )
      .then(response => dispatch(fetchFlightsSuccess(response, event)))
      .catch(error => dispatch(fetchFlightsError(error)));
  };
};

export const fetchDelayedFlights: IFlights.AC_FetchDelay = (
  airport: AirportCode,
  lang: LanguageType,
  offset: number,
  date?: ISOString
): any => {
  const selectedDate = date ? date : new Date().toISOString();
  return function(dispatch: Dispatch) {
    dispatch(fetchingFlights());
    axios
      .get(
        `/schedule/?apikey=${API_KEY}&station=${airport}&transport_types=plane&date=${selectedDate}&offset=${offset}&limit=500&lang=${
          // TODO: limit
          LANG_MAP[lang]
        }`
      )
      .then(response => dispatch(fetchDelaysSuccess(response)))
      .catch(error => dispatch(fetchFlightsError(error)));
  };
};

export const fetchFlightsSuccess: any = (data: any, event: EventType): Action => {
  return {
    event,
    data: {
      total: data.data.pagination.total,
      flights: data.data.schedule.map((flight: any) => {
        return {
          arrival: flight.arrival,
          departure: flight.departure,
          is_fuzzy: flight.is_fuzzy,
          thread: {
            title: flight.thread.title,
            number: flight.thread.number,
            uid: flight.thread.uid,
            carrier: flight.thread.carrier.title
          }
        };
      })
    },
    type: FETCH_FLIGHTS_SUCCESS
  };
};

export const fetchDelaysSuccess: any = (data: any, event: EventType): Action => {
  const delayedFlights: Array<any> = data.data.schedule.filter(
    (flight: any) => flight.is_fuzzy === true
  );
  return {
    event,
    data: {
      total: delayedFlights.length,
      flights: delayedFlights.map((flight: any) => {
        return {
          arrival: flight.arrival,
          departure: flight.departure,
          is_fuzzy: flight.is_fuzzy,
          thread: {
            title: flight.thread.title,
            number: flight.thread.number,
            uid: flight.thread.uid,
            carrier: flight.thread.carrier.title
          }
        };
      })
    },
    type: FETCH_DELAYS_SUCCESS
  };
};

export const fetchFlightsError: any = (error: AirportCode): Action => {
  return {
    error,
    type: FETCH_FLIGHTS_FAIL
  };
};
