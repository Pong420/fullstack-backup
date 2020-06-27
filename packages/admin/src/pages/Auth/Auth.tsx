import React, { ComponentType } from 'react';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { PATHS } from '../../constants';
import { CardWithLogo } from './CardWithLogo';
import { LoginForm } from './Form/LoginForm';
import { AdminRegisterForm } from './Form/AdminRegisterForm';

interface IRoute {
  title: string;
  path: string;
  component: ComponentType<RouteComponentProps>;
}

const routes: IRoute[] = [
  {
    title: 'LOGIN',
    path: PATHS.LOGIN,
    component: LoginForm
  },
  {
    title: 'ADMIN REGISTRATION',
    path: PATHS.ADMIN_REGISTRATION,
    component: AdminRegisterForm
  }
];

export function Auth() {
  return (
    <div className="auth">
      <Switch>
        {routes.map(({ path, title, component: Component }) => (
          <Route
            key={path}
            path={path}
            render={props => (
              <CardWithLogo title={title}>
                <Component {...props} />
              </CardWithLogo>
            )}
          />
        ))}
        <Redirect to={PATHS.LOGIN} />
      </Switch>
    </div>
  );
}
