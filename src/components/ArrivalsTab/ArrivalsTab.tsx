import * as React from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';

import { ReduxState, IAirport } from '../../types';
import { fetchArrivals } from '../../redux/reducers/airport';

interface IProps {
  airport: IAirport.State;
  fetchArrivals: any;
}
interface IState {}
const columns = [
  {
    title: 'Дата рейса',
    dataIndex: 'departure',
    key: 'departure'
  },
  {
    title: 'Рейс',
    dataIndex: 'thread.title',
    key: 'title'
  },
  {
    title: 'Самолет',
    dataIndex: 'thread.vehicle',
    key: 'vehicle'
  }
];

const dataSource = [
  {
    thread: {
      uid: 'S7-7_3_c23_547',
      title: 'Москва — Челябинск',
      number: 'S7 7',
      short_title: 'Москва — Челябинск',
      carrier: {
        code: 23,
        codes: {
          icao: null,
          sirena: 'С7',
          iata: 'S7'
        },
        title: 'S7 Airlines'
      },
      transport_type: 'plane',
      vehicle: 'Airbus А320'
    },
    departure: '2018-11-28T00:10:00+03:00'
  }
];

class ArrivalsTab extends React.Component<IProps, IState> {
  componentDidMount() {
    this.props.fetchArrivals('s9600216');
  }
  render() {
    return (
      <div className="arrivals">
        {console.log(this.props)}
        <Table dataSource={dataSource} columns={columns} rowKey="thread.uid" />
      </div>
    );
  }
}

export default connect(
  (state: ReduxState) => ({ airport: state.airport }),
  { fetchArrivals }
)(ArrivalsTab);
