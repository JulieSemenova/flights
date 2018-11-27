import * as React from 'react';

import { Input, Tabs } from 'antd';

import ArrivalsTab from './components/ArrivalsTab/ArrivalsTab';
import DelaysTab from './components/DelaysTab/DelaysTab';
import DeparturesTab from './components/DeparturesTab/DeparturesTab';
import { ITabConfig } from './types';

import './App.css';

const TabPane = Tabs.TabPane;
const Search = Input.Search;

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

class App extends React.Component {
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
        <Search />
        <Tabs>{tabs.map(this.renderPane)}</Tabs>
      </React.Fragment>
    );
  }
}

export default App;
