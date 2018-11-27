import * as React from 'react';

import { Tabs } from 'antd';

import ArrivalsTab from './components/ArrivalsTab/ArrivalsTab';
import DelaysTab from './components/DelaysTab/DelaysTab';
import DeparturesTab from './components/DeparturesTab/DeparturesTab';

import './App.css';

const TabPane = Tabs.TabPane;

const tabs = [
  {
    name: 'Прилет',
    component: ArrivalsTab
  },
  {
    name: 'Задержка',
    component: DelaysTab
  },
  {
    name: 'Вылет',
    component: DeparturesTab
  }
];

class App extends React.Component {
  renderPane = (tab: any) => {
    const Component: any = tab.component; // TODO: Fix any

    return (
      <TabPane tab={tab.name} key={tab.name}>
        <Component />
      </TabPane>
    );
  };

  public render() {
    return <Tabs>{tabs.map(this.renderPane)}</Tabs>;
  }
}

export default App;
