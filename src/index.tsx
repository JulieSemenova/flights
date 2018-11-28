import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import App from './App';
import reducers from './redux/reducers';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const mountPoint = document.getElementById('root') as HTMLElement;
const store = createStore(reducers);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  mountPoint
);
registerServiceWorker();
