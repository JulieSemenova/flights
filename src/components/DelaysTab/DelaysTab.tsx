import * as React from 'react';
import { connect } from 'react-redux';
import * as format from 'date-fns/format';
import { Table, Alert } from 'antd';
import { ColumnProps } from 'antd/lib/table';

import { ReduxState, IFlights, ISOString, LanguageType, AirportCode } from '../../types';
import { FORMAT_DAY, FORMAT_TIME, PAGE_SIZE, ERROR_MAP } from '../../constants';
import GetTranslation from '../GetTranslation/GetTranslation';

interface OwnProps {
  language: LanguageType;
  airportCode: AirportCode;
  date: ISOString;
  searchString: string;
}

interface IProps extends OwnProps {
  allFlights: IFlights.State['allFlights'];
  isFetching: IFlights.State['isFetching'];
  error: IFlights.State['error'];
}

class DelaysTab extends React.Component<IProps> {
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

  getData = () => {
    const { allFlights } = this.props;
    const fuzzyFlight = allFlights.flights.filter((flight: IFlights.Flight) => flight.is_fuzzy);
    return fuzzyFlight;
  }

  render() {
    const { isFetching, error, language } = this.props;
    return (
      <div className="delays">
        {error && <Alert type="error" message={ERROR_MAP[language]} />}
        <Table
          dataSource={this.getData()}
          columns={this.getColumns()}
          rowKey={(record: IFlights.Flight) => record.thread.uid}
          loading={isFetching}
          pagination={{
            total: this.getData().length,
            pageSize: PAGE_SIZE
          }}
        />
      </div>
    );
  }
}

export default connect(
  (state: ReduxState) => ({
    allFlights: state.flights.allFlights,
    error: state.flights.error,
    isFetching: state.flights.isFetching
  })
)(DelaysTab);
