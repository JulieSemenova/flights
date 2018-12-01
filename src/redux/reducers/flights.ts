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
export const FETCH_ALL_FLIGHTS_SUCCESS: string = 'airport/FETCH_ALL_FLIGHTS_SUCCESS';
export const FETCH_FLIGHTS: string = 'airport/FETCH_FLIGHTS';
export const FETCH_FLIGHTS_SUCCESS: string = 'airport/FETCH_FLIGHTS_SUCCESS';
export const FETCH_FLIGHTS_FAIL: string = 'airport/FETCH_FLIGHTS_FAIL';

export const initialState: IFlights.State = {
  isFetching: false,
  isFetched: false,
  allFlights: {
    total: 0,
    flights: []
  },
  arrivals: {
    total: 0,
    flights: []
  },
  departures: {
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
    case FETCH_ALL_FLIGHTS_SUCCESS:
      const allFlights = state.allFlights.flights.concat(action.data.flights);
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        allFlights: {
          total: action.data.total,
          flights: allFlights
        }
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

  return function (dispatch: Dispatch) {
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

export const fetchAllFlights: IFlights.AC_FetchAll = (
  airport: AirportCode,
  lang: LanguageType,
  limit: number,
  offset: number,
  date?: ISOString
): any => {
  const selectedDate = date ? date : new Date().toISOString();
  return function (dispatch: Dispatch) {
    axios
      .get(
        `/schedule/?apikey=${API_KEY}&station=${airport}&transport_types=plane&date=${selectedDate}&offset=${offset}&limit=${limit}&lang=${
          LANG_MAP[lang]
        }`
      )
      .then(response => dispatch(fetchAllFlightsSuccess(response)))
      .then((response) => {
        if (response.data.total > offset + limit) {
          dispatch(fetchAllFlights(airport, lang, response.data.total - limit, limit, date));
        }
      })
      .catch(error => dispatch(fetchFlightsError(error)));
  };
};

export const fetchAllFlightsSuccess: any = (data: any): Action => {
  return {
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
    type: FETCH_ALL_FLIGHTS_SUCCESS
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


export const fetchFlightsError: any = (error: AirportCode): Action => {
  return {
    error,
    type: FETCH_FLIGHTS_FAIL
  };
};
