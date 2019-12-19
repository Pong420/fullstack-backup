import React, { useCallback } from 'react';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { useRxAsync } from 'use-rx-hooks';
import { Button, Card, H5 } from '@blueprintjs/core';
import { UserForm, UserFormProps } from '../../components/UserForm';
import { loginStatusSelector } from '../../store';
import { adminRegistration } from '../../service';
import { UserRole } from '../../typings';
import { PATHS } from '../../constants';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { useSelector } from 'react-redux';

const exclude: UserFormProps['exclude'] = ['role'];

export function AdminRegistration({ location, history }: RouteComponentProps) {
  const loginsStatus = useSelector(loginStatusSelector);
  const valid =
    loginsStatus === 'loggedIn' &&
    !!(location.state && location.state.register);

  const onSuccess = useCallback(() => history.replace(PATHS.LOGIN, {}), [
    history
  ]);

  const { run, loading } = useRxAsync(adminRegistration, {
    defer: true,
    onSuccess
  });

  const onSubmit = useCallback(
    props => run({ ...props, role: UserRole.ADMIN }),
    [run]
  );

  if (valid) {
    return (
      <div className="admin-registration">
        <Card className="admin-registration-card">
          <div className="admin-registration-card-header">
            <Logo />
            <H5 children="ADMIN REGISTRATION" />
          </div>
          <div className="admin-registration-card-body">
            <UserForm onSubmit={onSubmit} exclude={exclude}>
              <Button fill type="submit" intent="primary" loading={loading}>
                Register
              </Button>
            </UserForm>
          </div>
        </Card>
      </div>
    );
  }

  return <Redirect to={PATHS.LOGIN} />;
}
