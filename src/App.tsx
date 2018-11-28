import * as React from 'react';
import { connect } from 'react-redux';
import { Input, Tabs, Select } from 'antd';

import ArrivalsTab from './components/ArrivalsTab/ArrivalsTab';
import DelaysTab from './components/DelaysTab/DelaysTab';
import DeparturesTab from './components/DeparturesTab/DeparturesTab';
import { ReduxState, ITabConfig, Language } from './types';
import { selectLanguage } from './redux/language';

import './App.css';

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const Option = Select.Option;

interface IProps {
  language: Language.State;
  selectLanguage: Language.AC_Select;
}
class App extends React.Component<IProps> {
  renderLanguageSelect = () => (
    <Select
      defaultValue={this.props.language.selectedLanguage}
      style={{ marginBottom: '20px' }}
      onChange={(value: Language) => this.props.selectLanguage(value)}
    >
      <Option value="ru">RU</Option>
      <Option value="en">EN</Option>
    </Select>
  );

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
        <Search style={{ marginBottom: '10px' }} />
        <Tabs>{tabs.map(this.renderPane)}</Tabs>
      </React.Fragment>
    );
  }
}

export default connect(
  (state: ReduxState) => ({ language: state.language }),
  { selectLanguage }
)(App);
