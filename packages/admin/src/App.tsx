import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { PATHS } from './constants';

const App = () => (
  <Router>
    <Switch>
      <Route exact path={PATHS.HOME} component={Home} />
      <Route exact path={PATHS.LOGIN} component={Login} />
    </Switch>
  </Router>
);

export default App;
