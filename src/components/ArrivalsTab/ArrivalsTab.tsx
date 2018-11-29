import * as React from 'react';
import { connect } from 'react-redux';
import * as format from 'date-fns/format';

import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';

import { ReduxState, IFlights, ISOString, LanguageType, AirportCode } from '../../types';
import { fetchFlights } from '../../redux/reducers/flights';
import { FORMAT_DAY, FORMAT_TIME } from 'src/constants';

interface OwnProps {
  language: LanguageType;
  airportCode: AirportCode;
  date: ISOString;
}
interface IProps extends OwnProps {
  arrivals: IFlights.State['arrivals'];
  isFetching: IFlights.State['isFetching'];
  fetchFlights: IFlights.AC_Fetch;
}
interface IState {}

class ArrivalsTab extends React.Component<IProps, IState> {
  componentDidMount() {
    const { airportCode, language, date } = this.props;
    // this.props.fetchFlights(
    //   this.props.airportCode,
    //   this.props.language,
    //   'arrival',
    //   '2018-11-29'
    // );
    console.log(airportCode, language, 'arrival', date);
  }

  shouldComponentUpdate(nextProps: IProps) {
    return this.props !== nextProps;
  }

  getColumns = () => {
    const flightColumns: Array<ColumnProps<IFlights.Flight>> = [
      {
        title: 'Дата рейса',
        dataIndex: 'arrival',
        key: 'arrival',
        render: this.renderFlightDate
      },
      {
        title: 'Рейс',
        dataIndex: 'thread.title',
        key: 'thread.title',
        render: this.renderFlightInfo
      },
      {
        title: 'Перевозчик',
        dataIndex: 'thread.carrier',
        key: 'thread.carrier'
      },
      {
        title: 'Самолет',
        dataIndex: 'thread.vehicle',
        key: 'thread.vehicle'
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

  renderFlightDate = (arrival: ISOString) => {
    return (
      <React.Fragment>
        {format(arrival, FORMAT_TIME)}
        <br />
        {format(arrival, FORMAT_DAY)}
      </React.Fragment>
    );
  };

  render() {
    const { arrivals, isFetching } = this.props;

    return (
      <div className="arrivals">
        <Table
          dataSource={arrivals}
          columns={this.getColumns()}
          rowKey="uid"
          loading={isFetching}
        />
      </div>
    );
  }
}

export default connect(
  (state: ReduxState) => ({
    arrivals: state.flights.arrivals,
    isFetching: state.flights.isFetching
  }),
  { fetchFlights }
)(ArrivalsTab);
