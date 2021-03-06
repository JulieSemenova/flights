import * as React from 'react';
import { connect } from 'react-redux';
import * as format from 'date-fns/format';
import { Table, Badge, Alert } from 'antd';
import { ColumnProps } from 'antd/lib/table';

import { ReduxState, IFlights, ITabs } from '../../types';
import { fetchFlights } from '../../redux/reducers/flights';
import { FORMAT_DAY, FORMAT_TIME, PAGE_SIZE, ERROR_MAP } from '../../constants';
import GetTranslation from '../GetTranslation/GetTranslation';

interface OwnProps extends ITabs.TabProps{}

interface IProps extends OwnProps {
  arrivals: IFlights.State['arrivals'];
  isFetching: IFlights.State['isFetching'];
  fetchFlights: IFlights.AC_Fetch;
  error: IFlights.State['error'];
}
interface IState {
  currentPage: number;
  pageSize: number;
}

class ArrivalsTab extends React.Component<IProps, IState> {
  state: IState = {
    currentPage: 1,
    pageSize: PAGE_SIZE
  };

  componentDidMount() {
    const { airportCode, language, date } = this.props;
    const { pageSize, currentPage } = this.state;
    const offset = currentPage > 1 ? (currentPage - 1) * pageSize : 0;
    this.props.fetchFlights(airportCode, language, 'arrival', offset, date);
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
      this.props.fetchFlights(airportCode, language, 'arrival', offset, date);
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
        {is_fuzzy && <Badge status="error" />} {/* задержка рейса */}
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
    const { arrivals, isFetching, error, language, searchFlights } = this.props;
    const isSearchingFlights = searchFlights && searchFlights.length > 0;
    return (
      <div className="arrivals">
        {error && <Alert type="error" message={ERROR_MAP[language]} />}
        <Table
          dataSource={isSearchingFlights ? searchFlights : arrivals.flights}
          columns={this.getColumns()}
          rowKey={(record: IFlights.Flight, dataIndex: number) => `${record.thread.uid}+${dataIndex}`}
          loading={isFetching}
          pagination={{
            total: isSearchingFlights ? searchFlights.length : arrivals.total,
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
    arrivals: state.flights.arrivals,
    isFetching: state.flights.isFetching,
    error: state.flights.error
  }),
  { fetchFlights }
)(ArrivalsTab);
