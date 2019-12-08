import React from 'react';
import { Switch } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { Users } from './pages/Users';
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
