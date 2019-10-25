import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Home } from './components/Home';
import { PATHS } from './constants';

const App = () => (
  <Switch>
    <Sidebar />
    <Route exact path={PATHS.HOME} component={Home} />
  </Switch>
);

export default App;
