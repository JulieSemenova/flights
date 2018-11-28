import * as React from 'react';
import { Input, Tabs, Select } from 'antd';

import ArrivalsTab from './components/ArrivalsTab/ArrivalsTab';
import DelaysTab from './components/DelaysTab/DelaysTab';
import DeparturesTab from './components/DeparturesTab/DeparturesTab';
import { ITabConfig, Languages } from './types';

import './App.css';

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const Option = Select.Option;

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
interface IProps {}
interface IState {
  language: Languages;
}
class App extends React.Component<IProps, IState> {
  state: IState = {
    language: 'ru'
  };
  renderLanguageSelect = () => (
    <Select
      defaultValue={this.state.language}
      style={{ marginBottom: '20px' }}
      onChange={(value: Languages) => this.setState({ language: value })}
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

export default App;
