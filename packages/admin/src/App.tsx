import React from 'react';
import { Switch } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { Orders } from './pages/Orders';
import { Products } from './pages/Products';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';
import { PATHS } from './constants';

const App = () => (
  <>
    <Sidebar />
    <Switch>
      <PrivateRoute exact path={PATHS.HOME} component={Home} />
      <PrivateRoute exact path={PATHS.USERS} component={Users} />
      <PrivateRoute exact path={PATHS.ORDERS} component={Orders} />
      <PrivateRoute exact path={PATHS.PRODUCTS} component={Products} />
      <PrivateRoute exact path={PATHS.SETTINGS} component={Settings} />
    </Switch>
  </>
);

export default App;