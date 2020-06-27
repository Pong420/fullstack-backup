import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { Auth } from './pages/Auth';
import { Home } from './pages/Home';
import { PATHS } from './constants';

const App = React.memo(() => (
  <Switch>
    <Route path={PATHS.AUTH} component={Auth} />
    <PrivateRoute exact path={PATHS.HOME} component={Home} />
  </Switch>
));

export default App;
