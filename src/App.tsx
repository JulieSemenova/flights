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
  language: Language.State['selectedLanguage'];
  selectLanguage: Language.AC_Select;
}
interface IState {
  // language: Language.State;
}

const tabs: Array<ITabConfig> = [
  {
    name: 'Прилет',
    component: ArrivalsTab
  },
  {
    name: 'Вылет',
    component: DeparturesTab
  },
  {
    name: 'Задержка',
    component: DelaysTab
  }
];
class App extends React.Component<IProps, IState> {
  // state: IState = {
  //   language: this.props.language
  // };

  renderLanguageSelect = () => (
    <Select
      defaultValue={this.props.language}
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
      <TabPane tab={tab.name} key={tab.name}>
        <Component />
      </TabPane>
    );
  };

  public render() {
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
  (state: ReduxState) => ({ language: state.language.selectedLanguage }),
  { selectLanguage }
)(App);
