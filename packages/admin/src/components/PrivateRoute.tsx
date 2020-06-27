import React, { useEffect } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PATHS } from '../constants';
import { loginStatusSelector, useAuthActions } from '../store';

export function PrivateRoute({
  component: Component,
  render,
  ...rest
}: RouteProps) {
  const loginStatus = useSelector(loginStatusSelector);
  const { authorize } = useAuthActions();

  useEffect(() => {
    loginStatus === 'unknown' && authorize();
  }, [authorize, loginStatus]);

  if (loginStatus === 'unknown' || loginStatus === 'loading') {
    return null;
  }

  return (
    <Route
      {...rest}
      render={props => {
        switch (loginStatus) {
          case 'loggedIn':
            if (render) {
              return render(props);
            } else if (Component) {
              return <Component {...props} />;
            }
        }
        return (
          <Redirect to={{ pathname: PATHS.LOGIN, state: props.location }} />
        );
      }}
    />
  );
}
