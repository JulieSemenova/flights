import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import Main from './components/Main/Main';
import reducers from './redux/reducers/reducers';
import './index.css';

const mountPoint = document.getElementById('root') as HTMLElement;
const store = createStore(reducers, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  mountPoint
);
