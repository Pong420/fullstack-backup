import React, { useCallback, FormEvent } from 'react';
import { Card, Button, InputGroup } from '@blueprintjs/core';
import { FormControl } from '../FormControl';
import { useForm, FormBuilder } from '../../hooks/useForm';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import * as validators from '../../utils/validators';

const formProps = FormBuilder({
  username: ['', validators.required('Username cannot be empty')],
  password: ['', validators.required('Password cannot be empty')]
});

const LoginForm = React.memo(() => {
  const { values, errors, handler, validate } = useForm(formProps);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      const hasError = validate();
      !hasError && console.log(values);
      event.preventDefault();
    },
    [values, validate]
  );

  return (
    <form onSubmit={onSubmit}>
      <FormControl label="Username" error={errors.username}>
        <InputGroup
          value={values.username}
          onChange={handler.username.handleChange}
        />
      </FormControl>
      <FormControl label="Password" error={errors.password}>
        <InputGroup
          type="password"
          value={values.password}
          onChange={handler.password.handleChange}
        />
      </FormControl>
      <Button fill type="submit" intent="primary">
        Login
      </Button>
    </form>
  );
});

export const Login = () => {
  return (
    <div className="login">
      <Card className="login-card" elevation={3}>
        <div className="login-card-header">
          <Logo />
        </div>
        <div className="login-card-body">
          <LoginForm />
        </div>
      </Card>
    </div>
  );
};
