import React, { useEffect, ReactElement } from 'react';
import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { loginStatusSelector, useAuthActions } from '../store';
import { PATHS } from '../constants';

interface ContentProps extends RouteComponentProps {
  children: ReactElement;
}

interface PrivateRouteProps extends Omit<RouteProps, 'render'> {
  render?: (props: RouteComponentProps) => ReactElement;
}

const PrivateRouteConent = ({ children, location }: ContentProps) => {
  const { authenticate } = useAuthActions();
  const loginStatus = useSelector(loginStatusSelector);

  useEffect(() => {
    loginStatus === 'unknown' && authenticate();
  }, [authenticate, loginStatus]);

  switch (loginStatus) {
    case 'unknown':
    case 'loading':
      return null;
    case 'loggedIn':
      return children;
    case 'required':
      return <Redirect to={{ pathname: PATHS.LOGIN, state: location }} />;
  }
};

export function PrivateRoute({
  component: Component,
  render,
  ...rest
}: PrivateRouteProps) {
  return (
    <Route
      {...rest}
      render={props => {
        let content: ReactElement | null = null;

        if (render) {
          content = render(props);
        } else if (Component) {
          content = <Component {...props} />;
        }

        if (content) {
          return <PrivateRouteConent {...props}>{content}</PrivateRouteConent>;
        }
      }}
    />
  );
}
