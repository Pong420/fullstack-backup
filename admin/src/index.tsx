import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { FocusStyleManager } from '@blueprintjs/core';
import { PATHS } from './constants';
import * as serviceWorker from './serviceWorker';

import './index.scss';

FocusStyleManager.onlyShowFocusOnTabs();

function render() {
  const Login = React.lazy(() => import('./components/Login'));
  const App = React.lazy(() => import('./App'));

  return ReactDOM.render(
    <Suspense fallback={null}>
      <Router>
        <Switch>
          <Route path={PATHS.LOGIN} component={Login} />
          <Route path="" component={App} />
        </Switch>
      </Router>
    </Suspense>,
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
