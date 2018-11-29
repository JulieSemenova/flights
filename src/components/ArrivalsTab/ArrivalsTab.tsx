import * as React from 'react';
import { connect } from 'react-redux';
import * as format from 'date-fns/format';
import { Table, Badge } from 'antd';
import { ColumnProps } from 'antd/lib/table';

import { ReduxState, IFlights, ISOString, LanguageType, AirportCode } from '../../types';
import { fetchFlights } from '../../redux/reducers/flights';
import { FORMAT_DAY, FORMAT_TIME } from 'src/constants';
import GetTranslation from '../GetTranslation/GetTranslation';

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
interface IState {
  currentPage: number;
  pageSize: number;
}

class ArrivalsTab extends React.Component<IProps, IState> {
  state: IState = {
    currentPage: 1,
    pageSize: 20
  };

  componentDidMount() {
    const { airportCode, language, date } = this.props;
    const { pageSize, currentPage } = this.state;
    const offset = currentPage === 1 && (currentPage - 1) * pageSize;
    // this.props.fetchFlights(
    //   airportCode,
    //   language,
    //   'arrival',
    // offset,
    //   date
    // );
    console.log(airportCode, language, 'arrival', date, offset);
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    const { airportCode, language, date } = this.props;
    const { pageSize, currentPage } = this.state;
    const offset = currentPage === 1 && (currentPage - 1) * pageSize;
    if (this.props !== prevProps || this.state !== prevState) {
      // this.props.fetchFlights(
      //   airportCode,
      //   language,
      //   'arrival',
      // offset,
      //   date
      // );
      console.log(airportCode, language, 'arrival', date, offset);
    }
  }

  getColumns = () => {
    const flightColumns: Array<ColumnProps<IFlights.Flight>> = [
      {
        title: <GetTranslation word="date" />,
        dataIndex: 'arrival',
        key: 'arrival',
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
    const { arrival, is_fuzzy } = flight;
    return (
      <React.Fragment>
        {is_fuzzy && <Badge status="error" />}
        {format(arrival!, FORMAT_TIME)}
        <br />
        {format(arrival!, FORMAT_DAY)}
      </React.Fragment>
    );
  };

  handleChangePage = (page: number, pageSize: number) => {
    this.setState({ pageSize, currentPage: page });
  };

  render() {
    const { arrivals, isFetching } = this.props;
    return (
      <div className="arrivals">
        <Table
          dataSource={arrivals.flights}
          columns={this.getColumns()}
          rowKey="uid"
          loading={isFetching}
          pagination={{
            total: arrivals.total,
            onChange: this.handleChangePage
          }}
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
