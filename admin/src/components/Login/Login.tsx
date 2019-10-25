import React, { FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, InputGroup } from '@blueprintjs/core';
import { FormControl } from '../FormControl';
import { useForm, FormBuilder } from '../../hooks/useForm';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { Param$Login } from '../../typings';
import { login } from '../../store';
import { loginStatusSelector } from '../../store';
import * as validators from '../../utils/validators';

interface LoginFormProps {
  loading?: boolean;
  onSumbit: (params: Param$Login) => void;
}

const formProps = FormBuilder({
  username: ['', validators.required('Username cannot be empty')],
  password: ['', validators.required('Password cannot be empty')]
});

const LoginForm = React.memo<LoginFormProps>(({ loading, onSumbit }) => {
  const { values, errors, handler, validate } = useForm(formProps);

  const onSubmitCallback = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const hasError = validate();
    !hasError && onSumbit(values);
  };

  return (
    <form onSubmit={onSubmitCallback}>
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
      <Button fill type="submit" intent="primary" loading={loading}>
        Login
      </Button>
    </form>
  );
});

export const Login = () => {
  const dispatch = useDispatch();
  const loginsStatus = useSelector(loginStatusSelector);
  const onSubmit: LoginFormProps['onSumbit'] = params =>
    dispatch(login(params));

  return (
    <div className="login">
      <Card className="login-card" elevation={3}>
        <div className="login-card-header">
          <Logo />
        </div>
        <div className="login-card-body">
          <LoginForm loading={loginsStatus === 'loading'} onSumbit={onSubmit} />
        </div>
      </Card>
    </div>
  );
};