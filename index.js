import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'filepond-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import history from './util/history';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';

import App from './App';
import i18n from './i18n';
import * as serviceWorker from './serviceWorker';
import { Loading } from './components/core/loading/loading.component';

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
      <Loading />
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
