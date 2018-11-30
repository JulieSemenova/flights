import * as React from 'react';
import { connect } from 'react-redux';
import * as format from 'date-fns/format';
import { Table, Alert } from 'antd';
import { ColumnProps } from 'antd/lib/table';

import { ReduxState, IFlights, ISOString, LanguageType, AirportCode } from '../../types';
import { fetchDelayedFlights } from '../../redux/reducers/flights';
import { FORMAT_DAY, FORMAT_TIME, PAGE_SIZE, ERROR_MAP } from '../../constants';
import GetTranslation from '../GetTranslation/GetTranslation';

interface OwnProps {
  language: LanguageType;
  airportCode: AirportCode;
  date: ISOString;
  searchString: string;
}
interface IProps extends OwnProps {
  delays: IFlights.State['delays'];
  isFetching: IFlights.State['isFetching'];
  fetchDelayedFlights: IFlights.AC_FetchDelay;
  error: IFlights.State['error'];
}
interface IState {
  currentPage: number;
  pageSize: number;
}

class DelaysTab extends React.Component<IProps, IState> {
  state: IState = {
    currentPage: 1,
    pageSize: PAGE_SIZE
  };

  componentDidMount() {
    const { airportCode, language, date } = this.props;
    const { pageSize, currentPage } = this.state;
    const offset = currentPage > 1 ? (currentPage - 1) * pageSize : 0;
    this.props.fetchDelayedFlights(airportCode, language, offset, date);
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    const { airportCode, language, date } = this.props;
    const { pageSize, currentPage } = this.state;
    const offset = currentPage > 1 ? (currentPage - 1) * pageSize : 0;
    if (
      this.state !== prevState ||
      airportCode !== prevProps.airportCode ||
      language !== prevProps.language ||
      date !== prevProps.date
    ) {
      this.props.fetchDelayedFlights(airportCode, language, offset, date);
    }
  }

  getColumns = () => {
    const flightColumns: Array<ColumnProps<IFlights.Flight>> = [
      {
        title: <GetTranslation word="date" />,
        dataIndex: 'departure',
        key: 'departure',
        render: this.renderFlightDate
      },
      {
        title: <GetTranslation word="flight" />,
        dataIndex: 'thread.title',
        key: 'thread.title',
        render: this.renderFlightInfo
      },
      {
        title: <GetTranslation word="carrier" />,
        dataIndex: 'thread.carrier',
        key: 'thread.carrier'
      }
    ];
    return flightColumns;
  };

  renderFlightInfo = (_: any, flight: IFlights.Flight) => {
    return (
      <React.Fragment>
        <b>{flight.thread.number}</b>
        <br />
        {flight.thread.title}
      </React.Fragment>
    );
  };

  renderFlightDate = (_: any, flight: IFlights.Flight) => {
    const { departure, arrival } = flight;
    if (arrival) {
      return (
        <React.Fragment>
          {format(arrival, FORMAT_TIME)}
          <br />
          {format(arrival, FORMAT_DAY)}
        </React.Fragment>
      );
    }
    if (departure) {
      return (
        <React.Fragment>
          {format(departure, FORMAT_TIME)}
          <br />
          {format(departure, FORMAT_DAY)}
        </React.Fragment>
      );
    }
    return null;
  };

  handleChangePage = (page: number, pageSize: number) => {
    this.setState({ pageSize, currentPage: page });
  };

  renderSearchFlights = () => {
    const { delays, searchString } = this.props;
    const searchRegExp = new RegExp(searchString, 'i');
    const flight = delays.flights.filter((flight: IFlights.Flight) =>
      flight.thread.number.match(searchRegExp)
    );
    return flight;
  };

  render() {
    const { delays, isFetching, error, language, searchString } = this.props;
    return (
      <div className="delays">
        {error && <Alert type="error" message={ERROR_MAP[language]} />}
        <Table
          dataSource={!searchString ? delays.flights : this.renderSearchFlights()}
          columns={this.getColumns()}
          rowKey={(record: IFlights.Flight) => record.thread.uid}
          loading={isFetching}
          pagination={{
            total: delays.total,
            onChange: this.handleChangePage,
            pageSize: PAGE_SIZE
          }}
        />
      </div>
    );
  }
}

export default connect(
  (state: ReduxState) => ({
    delays: state.flights.delays,
    isFetching: state.flights.isFetching,
    error: state.flights.error
  }),
  { fetchDelayedFlights }
)(DelaysTab);
