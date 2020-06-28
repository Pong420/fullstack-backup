import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { PrivateRoute } from './components/PrivateRoute';
import { Auth } from './pages/Auth';
import { Home } from './pages/Home';
import { PATHS } from './constants';

function Main() {
  return (
    <>
      <Sidebar />
      <PrivateRoute exact path={PATHS.HOME} component={Home} />
    </>
  );
}

const App = React.memo(() => (
  <Switch>
    <Route path={PATHS.AUTH} component={Auth} />
    <Route path="" component={Main} />
  </Switch>
));

export default App;
