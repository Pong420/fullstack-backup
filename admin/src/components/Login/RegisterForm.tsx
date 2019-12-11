import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useRxAsync } from 'use-rx-hooks';
import { Button, H5 } from '@blueprintjs/core';
import { UserForm, UserFormProps } from '../UserForm';
import { register } from '../../services';
import { UserRole } from '../../typings';
import { PATHS } from '../../constants';
import { validators } from '../../utils/form';

const exclude: UserFormProps['exclude'] = ['role'];
const passwordValidators: UserFormProps['passwordValidators'] = [
  validators.password()
];

export function RegisterForm() {
  const history = useHistory();
  const onSuccess = useCallback(() => history.replace(PATHS.LOGIN, {}), [
    history
  ]);
  const { run, loading } = useRxAsync(register, { defer: true, onSuccess });
  const onSubmit = useCallback(
    props => run({ ...props, role: UserRole.ADMIN }),
    [run]
  );

  return (
    <div className="register-form">
      <H5>Regiser Admin Account</H5>
      <UserForm
        onSubmit={onSubmit}
        exclude={exclude}
        passwordValidators={passwordValidators}
      >
        <Button fill type="submit" intent="primary" loading={loading}>
          Register
        </Button>
      </UserForm>
    </div>
  );
}
