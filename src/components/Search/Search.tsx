import * as React from 'react';
import { connect } from 'react-redux';
import { Input } from 'antd';

import {
  ReduxState,
  IFlights,
  LanguageType,
  AirportCode,
  ISOString
} from '../../types';
import { fetchAllFlights } from '../../redux/reducers/flights';
import { START_LIMIT } from '../../constants';
import GetTranslation from '../GetTranslation/GetTranslation';

const Search = Input.Search;

interface OwnProps {
  language: LanguageType;
  airportCode: AirportCode;
  date: ISOString;
  getFlights: (flights: Array<IFlights.Flight>) => void;
}

interface IProps extends OwnProps {
  allFlights: IFlights.State['allFlights'];
  fetchAllFlights: IFlights.AC_FetchAll;
}

interface IState {
  searchString: string;
  amount: number | null;
}

class SearchComponent extends React.Component<IProps, IState> {
  state: IState = {
    searchString: '',
    amount: null
  };

  componentDidMount() {
    const { airportCode, language, date } = this.props;
    this.props.fetchAllFlights(airportCode, language, START_LIMIT, 0, date);
  }

  componentDidUpdate(prevProps: IProps) {
    const { airportCode, language, date } = this.props;
    if (
      airportCode !== prevProps.airportCode ||
      language !== prevProps.language ||
      date !== prevProps.date
    ) {
      this.props.fetchAllFlights(airportCode, language, START_LIMIT, 0, date);
    }
  }

  handleChange = (key: keyof IState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, [key]: event.target.value }, () => this.renderSearchFlights());
  };

  renderSearchFlights = () => {
    const { allFlights, getFlights } = this.props;
    const { searchString } = this.state;
    const searchRegExp = new RegExp(searchString, 'i');
    const flights = allFlights.flights.filter((flight: IFlights.Flight) =>
      flight.thread.number.match(searchRegExp)
    );
    this.setState({ amount: flights.length });
    getFlights(flights);
  };

  handleBlur = () => {
    const { getFlights } = this.props;

    this.setState({ searchString: '', amount: null }, () => getFlights([]));
  }

  renderAmount = () => {
    const { amount } = this.state;
    if (amount !== null) {
      return (
        <div style={{ display: 'inline-block', marginLeft: '20px' }}>
          {amount !== 0 ? <React.Fragment><GetTranslation word="flights" /> {amount}</React.Fragment> : <GetTranslation word="noFlights" />}
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="search">
        <Search
          onChange={this.handleChange('searchString')}
          style={{ marginBottom: '10px', width: '400px' }}
          value={this.state.searchString}
          onBlur={this.handleBlur}
        />
        {this.renderAmount()}
      </div>
    );
  }
}

export default connect(
  (state: ReduxState) => ({
    allFlights: state.flights.allFlights,
  }),
  { fetchAllFlights }
)(SearchComponent);
