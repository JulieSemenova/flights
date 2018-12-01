import * as React from 'react';
import * as format from 'date-fns/format';
import { connect } from 'react-redux';
import { Tabs, Select } from 'antd';
import axios from 'axios';

import ArrivalsTab from '../ArrivalsTab/ArrivalsTab';
import DelaysTab from '../DelaysTab/DelaysTab';
import DeparturesTab from '../DeparturesTab/DeparturesTab';
import GetTranslation from '../GetTranslation/GetTranslation';
import Search from '../Search/Search';
import {
  ReduxState,
  ITabs,
  IDictionary,
  LanguageType,
  AirportCode,
  ISOString,
  IFlights
} from '../../types';
import { getDictionary } from '../../redux/reducers/dictionary';

import { FORMAT_FULL_DAY, API_KEY } from '../../constants';
import getISODate from '../../helpers/getISODate';
import './Main.css';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

interface IProps {
  dictionary: IDictionary.State;
  getDictionary: IDictionary.AC_GetDictionary;
}
interface IState {
  language: LanguageType;
  airportCode: AirportCode;
  date: ISOString;
  searchFlights: Array<IFlights.Flight>;
  copyright: any;
}

export class Main extends React.Component<IProps, IState> {
  state: IState = {
    language: 'ru',
    airportCode: 's9600216',
    date: format(new Date(), FORMAT_FULL_DAY),
    searchFlights: [],
    copyright: {}
  };

  componentDidMount() {
    this.props.getDictionary('ru');
    axios
      .get(
        `/copyright/?apikey=${API_KEY}&format=json`
      )
      .then(response => this.setState({ copyright: response.data.copyright }))
      .catch(error => console.log(error));
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (prevState.language !== this.state.language) {
      this.props.getDictionary(this.state.language);
    }
  }

  renderCopyrights = () => {
    const { copyright } = this.state;
    if (copyright) {
      return (
        <div>
          <div key={copyright.logo_hy} dangerouslySetInnerHTML={{ __html:copyright.logo_hy }} />
          <p>{copyright.text} {' '} <a href={copyright.upl}> {copyright.url}</a></p>
        </div>
      );
    }
    return null;
  }

  getAttrs = (iframeTag: any) => {
    const doc = document.createElement('div');
    doc.innerHTML = iframeTag;
    const iframe = doc.getElementsByTagName('iframe')[0];
    return [].slice
      .call(iframe.attributes)
      .reduce((attrs: any, element: any) => {
        attrs[element.name] = element.value;
        return attrs;
      }, {});
  }

  renderLanguageSelect = () => (
    <Select
      defaultValue={this.props.dictionary.selectedLanguage}
      style={{ marginBottom: '20px' }}
      onChange={(value: LanguageType) =>
        this.setState({ ...this.state, language: value })
      }
    >
      <Option value="ru">RU</Option>
      <Option value="en">EN</Option>
    </Select>
  );

  renderAirportSelect = () => (
    <Select
      defaultValue={this.state.airportCode}
      style={{ marginBottom: '20px' }}
      onChange={(value: AirportCode) =>
        this.setState({ ...this.state, airportCode: value })
      }
    >
      <Option value="s9600216">
        <GetTranslation word="domodedovo" />
      </Option>
      <Option value="s9600215">
        <GetTranslation word="vnukovo" />
      </Option>
      <Option value="s9600213">
        <GetTranslation word="sheremetyevo" />
      </Option>
    </Select>
  );

  renderDateSelect = () => {
    const now = new Date();
    const today = format(now, FORMAT_FULL_DAY);
    const yesterday = getISODate(now, -1);
    const tomorrow = getISODate(now, 1);
    return (
      <Select
        defaultValue={today}
        style={{ marginBottom: '20px' }}
        onChange={(value: ISOString) => this.setState({ ...this.state, date: value })}
      >
        <Option value={yesterday}>
          <GetTranslation word="yesterday" />
        </Option>
        <Option value={today}>
          <GetTranslation word="today" />
        </Option>
        <Option value={tomorrow}>
          <GetTranslation word="tomorrow" />
        </Option>
      </Select>
    );
  };

  renderPane = (tab: ITabs.Config) => {
    const Component: React.ComponentClass<ITabs.TabProps> = tab.component;
    return (
      <TabPane tab={<GetTranslation word={tab.name} />} key={tab.name}>
        <Component {...this.state} />
      </TabPane>
    );
  };

  handleChange = (key: keyof IState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, [key]: event.target.value });
  };

  getFlights = (flights: Array<IFlights.Flight>) => {
    this.setState({ searchFlights: flights });
  }

  public render() {
    const tabs: Array<ITabs.Config> = [
      {
        name: 'arrivals',
        component: ArrivalsTab
      },
      {
        name: 'departures',
        component: DeparturesTab
      },
      {
        name: 'delays',
        component: DelaysTab
      }
    ];

    return (
      <div className="main">
        {this.renderAirportSelect()}
        {this.renderDateSelect()}
        {this.renderLanguageSelect()}
        <Search {...this.state} getFlights={this.getFlights} />
        <Tabs>{tabs.map(this.renderPane)}</Tabs>
        {this.renderCopyrights()}
      </div>
    );
  }
}

export default connect(
  (state: ReduxState) => ({
    dictionary: state.dictionary
  }),
  { getDictionary }
)(Main);
