import * as React from 'react';
import { connect } from 'react-redux';
import { Input, Tabs, Select } from 'antd';

import ArrivalsTab from './components/ArrivalsTab/ArrivalsTab';
import DelaysTab from './components/DelaysTab/DelaysTab';
import DeparturesTab from './components/DeparturesTab/DeparturesTab';
import {
  ReduxState,
  ITabConfig,
  ILanguage,
  LanguageType,
  IAirport,
  AirportCode
} from './types';
import { selectLanguage } from './redux/reducers/language';
import { selectAirport } from './redux/reducers/airport';

import './App.css';

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const Option = Select.Option;

interface IProps {
  language: ILanguage.State;
  selectLanguage: ILanguage.AC_Select;
  airport: IAirport.State;
  selectAirport: IAirport.AC_Select;
}
interface IState {
  language: LanguageType;
}

class App extends React.Component<IProps, IState> {
  state: IState = {
    language: 'ru'
  };
  // componentDidUpdate() {
  //   console.log('update');
  // }
  renderLanguageSelect = () => (
    <Select
      defaultValue={this.props.language.selectedLanguage}
      style={{ marginBottom: '20px' }}
      onChange={(value: LanguageType) => this.props.selectLanguage(value)}
    >
      <Option value="ru">RU</Option>
      <Option value="en">EN</Option>
    </Select>
  );

  renderAirportSelect = () => {
    <Select
      defaultValue={this.props.airport.selectedAirport}
      style={{ marginBottom: '20px' }}
      onChange={(value: AirportCode) => this.props.selectAirport(value)}
    >
      <Option value="s9600216">Домодедово</Option>
      <Option value="s9600215">Внуково</Option>
      <Option value="s9600213">Шереметьево</Option>
    </Select>;
  };

  renderPane = (tab: ITabConfig) => {
    const Component: React.ComponentClass = tab.component;

    return (
      <TabPane tab={this.getPaneName(tab.name)} key={tab.name}>
        <Component />
      </TabPane>
    );
  };

  getPaneName = (name: string) => {
    const { dictionary } = this.props.language;
    return (
      <span style={{ textTransform: 'capitalize' }}>
        {dictionary[name] ? dictionary[name] : name}
      </span>
    );
  };

  public render() {
    const tabs: Array<ITabConfig> = [
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
      <React.Fragment>
        {this.renderLanguageSelect()}
        {this.renderAirportSelect()}

        <Search style={{ marginBottom: '10px' }} />
        <Tabs>{tabs.map(this.renderPane)}</Tabs>
      </React.Fragment>
    );
  }
}

export default connect(
  (state: ReduxState) => ({ language: state.language, airport: state.airport }),
  { selectLanguage, selectAirport }
)(App);
