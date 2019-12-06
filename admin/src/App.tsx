import React from 'react';
import { Switch } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { Sidebar } from './components/Sidebar';
import { Home } from './components/Home';
import { Users } from './components/Users';
import { PATHS } from './constants';

const App = () => (
  <>
    <Sidebar />
    <Switch>
      <PrivateRoute exact path={PATHS.HOME} component={Home} />
      <PrivateRoute exact path={PATHS.USERS} component={Users} />
      <PrivateRoute exact path={PATHS.USERS} component={Users} />
    </Switch>
  </>
);

export default App;
