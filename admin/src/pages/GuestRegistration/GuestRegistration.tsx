import React, { useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useRxAsync } from 'use-rx-async';
import { Card, Button, H5 } from '@blueprintjs/core';
import { UserForm, UserFormProps } from '../../components/UserForm';
import { PATHS } from '../../constants';
import { UserRole } from '../../typings';
import { guestRegistration } from '../../services';
import { ReactComponent as Logo } from '../../assets/logo.svg';

const exclude: UserFormProps['exclude'] = ['role'];

export function GuestRegistration({ history }: RouteComponentProps) {
  const onSuccess = useCallback(() => history.replace(PATHS.LOGIN, {}), [
    history
  ]);
  const { run, loading } = useRxAsync(guestRegistration, {
    defer: true,
    onSuccess
  });
  const onSubmit = useCallback(
    props => run({ ...props, role: UserRole.GUEST }),
    [run]
  );

  return (
    <div className="guest-registration">
      <Card className="guest-registration-card">
        <div className="guest-registration-card-header">
          <Logo />
          <H5 children="GUEST REGISTRATION" />
        </div>
        <div className="guest-registration-card-body">
          <UserForm exclude={exclude} onSubmit={onSubmit}>
            <Button fill type="submit" intent="primary" loading={loading}>
              Register
            </Button>

            <Button
              fill
              minimal
              className="already-have-account"
              onClick={() => history.push(PATHS.LOGIN)}
            >
              Already have account
            </Button>
          </UserForm>
        </div>
      </Card>
    </div>
  );
}
