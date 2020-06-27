import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { PATHS } from './constants';

const App = React.memo(() => (
  <Switch>
    <Route exact path={PATHS.LOGIN} component={Login} />
    <Route exact path={PATHS.HOME} component={Home} />
  </Switch>
));

export default App;
