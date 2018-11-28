import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './redux/configureStore';

const store = configureStore();
const mountPoint = document.getElementById('root') as HTMLElement;
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  mountPoint
);
registerServiceWorker();
