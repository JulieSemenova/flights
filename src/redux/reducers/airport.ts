import { Action, IAirport, AirportCode } from '../../types';
import { API_KEY } from '../../constants';
import axios from 'axios';

export const SELECT_AIRPORT: string = 'airport/SELECT_AIRPORT';
export const FETCH_ARRIVALS: string = 'airport/FETCH_ARRIVALS';
export const FETCH_ARRIVALS_SUCCESS: string = 'airport/FETCH_ARRIVALS_SUCCESS';
export const FETCH_ARRIVALS_FAIL: string = 'airport/FETCH_ARRIVALS_FAIL';

export const initialState: IAirport.State = {
  selectedAirport: 's9600216',
  isFetching: false,
  isFetched: false,
  arrivals: [],
  error: null
};

export default function reducer(
  state: IAirport.State = initialState,
  action: Action = {}
): IAirport.State {
  switch (action.type) {
    case SELECT_AIRPORT: {
      return {
        ...state,
        selectedAirport: action.data
      };
    }
    case FETCH_ARRIVALS:
      return {
        ...state,
        isFetching: true
      };
    case FETCH_ARRIVALS_SUCCESS:
      console.log(action.data);
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        arrivals: action.data
      };
    case FETCH_ARRIVALS_FAIL:
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

export const selectAirport: IAirport.AC_Select = (data: AirportCode): Action => {
  return {
    data,
    type: SELECT_AIRPORT
  };
};

export const fetchArrivals: any = (data: AirportCode): Action => {
  axios
    .get(
      `/schedule/?apikey=${API_KEY}&station=${data}&transport_types=plane&event=departure&date=2018-11-28`
    )
    .then(response => fetchArrivalsSuccess(response))
    .catch(error => console.log(error));
  return {
    type: FETCH_ARRIVALS
  };
};

export const fetchArrivalsSuccess: any = (data: any): Action => {
  console.log('sdfj');
  return {
    data,
    type: FETCH_ARRIVALS_SUCCESS
  };
};

export const fetchArrivalsError: any = (error: AirportCode): Action => {
  return {
    error,
    type: FETCH_ARRIVALS_FAIL
  };
};
