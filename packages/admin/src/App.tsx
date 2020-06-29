import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { PrivateRoute } from './components/PrivateRoute';
import { ConfirmDialogProvider } from './components/ConfirmDialog';
import { Auth } from './pages/Auth';
import { Home } from './pages/Home';
import { Orders } from './pages/Orders';
import { Products } from './pages/Products';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';
import { PATHS } from './constants';

const Main = React.memo(() => {
  return (
    <ConfirmDialogProvider>
      <Sidebar />
      <PrivateRoute exact path={PATHS.HOME} component={Home} />
      <PrivateRoute path={PATHS.ORDERS} component={Orders} />
      <PrivateRoute path={PATHS.PRODUCTS} component={Products} />
      <PrivateRoute path={PATHS.USERS} component={Users} />
      <PrivateRoute path={PATHS.SETTINGS} component={Settings} />
    </ConfirmDialogProvider>
  );
});

const App = React.memo(() => (
  <Switch>
    <Route path={PATHS.AUTH} component={Auth} />
    <Route path="" component={Main} />
  </Switch>
));

export default App;
