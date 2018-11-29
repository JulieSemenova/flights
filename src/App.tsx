import * as React from 'react';
import * as format from 'date-fns/format';
import { connect } from 'react-redux';
import { Input, Tabs, Select } from 'antd';

import ArrivalsTab from './components/ArrivalsTab/ArrivalsTab';
import DelaysTab from './components/DelaysTab/DelaysTab';
import DeparturesTab from './components/DeparturesTab/DeparturesTab';
import {
  ReduxState,
  ITabs,
  ILanguage,
  LanguageType,
  AirportCode,
  ISOString
} from './types';
import { selectLanguage } from './redux/reducers/language';

import './App.css';
import { FORMAT_FULL_DAY } from './constants';
import getISODate from './helpers/getISODate';

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const Option = Select.Option;

interface IProps {
  language: ILanguage.State;
  selectLanguage: ILanguage.AC_Select;
}
interface IState {
  language: LanguageType;
  airportCode: AirportCode;
  date: ISOString;
}
class App extends React.Component<IProps, IState> {
  state: IState = {
    language: 'ru',
    airportCode: 's9600216',
    date: format(new Date(), FORMAT_FULL_DAY)
  };

  renderLanguageSelect = () => (
    <Select
      defaultValue={this.props.language.selectedLanguage}
      style={{ marginBottom: '20px' }}
      onChange={(value: LanguageType) =>
        this.setState({ ...this.state, language: value }, () =>
          this.props.selectLanguage(value)
        )
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
      <Option value="s9600216">Домодедово</Option>
      <Option value="s9600215">Внуково</Option>
      <Option value="s9600213">Шереметьево</Option>
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
        <Option value={yesterday}>Вчера</Option>
        <Option value={today}>Сегодня</Option>
        <Option value={tomorrow}>Завтра</Option>
      </Select>
    );
  };

  renderPane = (tab: ITabs.Config) => {
    const Component: React.ComponentClass<ITabs.TabProps> = tab.component;
    const { language, airportCode, date } = this.state;
    return (
      <TabPane tab={this.getPaneName(tab.name)} key={tab.name}>
        <Component language={language} airportCode={airportCode} date={date} />
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
      <React.Fragment>
        {this.renderLanguageSelect()}
        {this.renderAirportSelect()}
        {this.renderDateSelect()}
        <Search style={{ marginBottom: '10px' }} />
        <Tabs>{tabs.map(this.renderPane)}</Tabs>
      </React.Fragment>
    );
  }
}

export default connect(
  (state: ReduxState) => ({
    language: state.language
  }),
  { selectLanguage }
)(App);
