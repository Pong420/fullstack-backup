import React, { useEffect } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PATHS } from '../constants';
import { refreshToken, loginStatusSelector, useActions } from '../store';

const actions = { refreshToken };

export function PrivateRoute({
  component: Component,
  render,
  ...rest
}: RouteProps) {
  const { refreshToken } = useActions(actions);
  const loginStatus = useSelector(loginStatusSelector);

  useEffect(() => {
    loginStatus === 'unknown' && refreshToken();
  }, [refreshToken, loginStatus]);

  if (loginStatus === 'unknown') {
    return null;
  }

  return (
    <Route
      {...rest}
      render={props => {
        if (loginStatus === 'loggedIn') {
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
