import React, { useEffect } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { PATHS } from '../constants';
import { refreshToken, loginStatusSelector } from '../store';

export function PrivateRoute({
  component: Component,
  render,
  ...rest
}: RouteProps) {
  const dispatch = useDispatch();
  const loginStatus = useSelector(loginStatusSelector);

  useEffect(() => {
    loginStatus === 'unknown' && dispatch(refreshToken());
  }, [dispatch, loginStatus]);

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
