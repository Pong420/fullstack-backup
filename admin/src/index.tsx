import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { FocusStyleManager } from '@blueprintjs/core';
import { PATHS } from './constants';
import configureStore, { history, logout } from './store';
import * as serviceWorker from './serviceWorker';

import './index.scss';
import 'typeface-muli';

const store = configureStore();

FocusStyleManager.onlyShowFocusOnTabs();

// sync log out if user logged in on the different tab
window.addEventListener('storage', event => {
  if (event.key === 'logout') {
    history.push(PATHS.LOGIN);
    store.dispatch(logout());
  }
});

function render() {
  const Login = React.lazy(() => import('./pages/Login'));
  const GuestRegistration = React.lazy(() =>
    import('./pages/GuestRegistration')
  );
  const AdminRegistration = React.lazy(() =>
    import('./pages/AdminRegistration')
  );
  const App = React.lazy(() => import('./App'));

  return ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Suspense fallback={null}>
          <Switch>
            <Route path={PATHS.LOGIN} component={Login} />
            <Route
              path={PATHS.GUEST_REGISTRATION}
              component={GuestRegistration}
            />
            <Route
              path={PATHS.ADMIN_REGISTRATION}
              component={AdminRegistration}
            />
            <Route path="" component={App} />
          </Switch>
        </Suspense>
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
  );
}

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

if (module.hot) {
  module.hot.accept('./App', render);
}
