import * as React from 'react';
import * as format from 'date-fns/format';
import { connect } from 'react-redux';
import { Input, Tabs, Select } from 'antd';

import ArrivalsTab from '../ArrivalsTab/ArrivalsTab';
import DelaysTab from '../DelaysTab/DelaysTab';
import DeparturesTab from '../DeparturesTab/DeparturesTab';
import GetTranslation from '../GetTranslation/GetTranslation';

import {
  ReduxState,
  ITabs,
  IDictionary,
  LanguageType,
  AirportCode,
  ISOString
} from '../../types';
import { getDictionary } from '../../redux/reducers/dictionary';

import './Main.css';
import { FORMAT_FULL_DAY } from '../../constants';
import getISODate from '../../helpers/getISODate';

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const Option = Select.Option;

interface IProps {
  dictionary: IDictionary.State;
  getDictionary: IDictionary.AC_GetDictionary;
}
interface IState {
  selectedLanguage: LanguageType;
  airportCode: AirportCode;
  date: ISOString;
  searchString: string;
}
class App extends React.Component<IProps, IState> {
  state: IState = {
    selectedLanguage: 'ru',
    airportCode: 's9600216',
    date: format(new Date(), FORMAT_FULL_DAY),
    searchString: ''
  };

  componentDidMount() {
    this.props.getDictionary('ru');
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (prevState.selectedLanguage !== this.state.selectedLanguage) {
      this.props.getDictionary(this.state.selectedLanguage);
    }
  }

  renderLanguageSelect = () => (
    <Select
      defaultValue={this.props.dictionary.selectedLanguage}
      style={{ marginBottom: '20px' }}
      onChange={(value: LanguageType) =>
        this.setState({ ...this.state, selectedLanguage: value })
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
    const { selectedLanguage } = this.state;
    return (
      <TabPane tab={<GetTranslation word={tab.name} />} key={tab.name}>
        <Component language={selectedLanguage} {...this.state} />
      </TabPane>
    );
  };

  handleChange = (key: keyof IState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, [key]: event.target.value });
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
      <div className="main">
        {this.renderAirportSelect()}
        {this.renderDateSelect()}
        {this.renderLanguageSelect()}
        <Search
          onChange={this.handleChange('searchString')}
          style={{ marginBottom: '10px' }}
        />
        <Tabs>{tabs.map(this.renderPane)}</Tabs>
      </div>
    );
  }
}

export default connect(
  (state: ReduxState) => ({
    dictionary: state.dictionary
  }),
  { getDictionary }
)(App);
