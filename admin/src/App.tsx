import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Home } from './components/Home';
import { PATHS } from './constants';

const App = () => (
  <Router>
    <Sidebar />
    <Switch>
      <Route exact path={PATHS.HOME} component={Home} />
    </Switch>
  </Router>
);

export default App;
