import React from 'react';
import { Switch } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { Sidebar } from './components/Sidebar';
import { Home } from './components/Home';
import { PATHS } from './constants';

const App = () => (
  <Switch>
    <Sidebar />
    <PrivateRoute exact path={PATHS.HOME} component={Home} />
  </Switch>
);

export default App;
