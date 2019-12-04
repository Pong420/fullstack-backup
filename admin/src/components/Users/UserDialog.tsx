import React, { useMemo, useCallback, Dispatch } from 'react';
import { useDispatch } from 'react-redux';
import { AxiosPromise } from 'axios';
import { Intent, InputGroup, HTMLSelect } from '@blueprintjs/core';
import { AsyncFnDialog, AsyncFnDialogProps } from '../Dialog';
import { FormControl } from '../FormControl';
import { FormBuilder, useForm } from '../../hooks/useForm';
import {
  UserRole,
  Param$CreateUser,
  Schema$User,
  Response$API
} from '../../typings';
import { UserActions } from '../../store';
import * as validators from '../../utils/validators';

interface Fields extends Param$CreateUser {
  role?: UserRole;
}

const defaultValue: Fields = {
  email: '',
  username: '',
  password: '',
  role: undefined
};

interface Props extends Omit<AsyncFnDialogProps, 'asyncFn'> {
  id?: string;
  initialValues?: Partial<Fields>;
  action: (user: Schema$User) => UserActions;
  apiRequest: (
    fields: Fields & { id?: string }
  ) => AxiosPromise<Response$API<Schema$User>>;
}

export const UserDialog = React.memo(
  ({ id, initialValues, action, apiRequest, ...props }: Props) => {
    const dispatch = useDispatch<Dispatch<UserActions>>();

    const form = useMemo(() => {
      const values = { ...defaultValue, ...initialValues };
      return FormBuilder({
        email: [values.email, validators.required('email cannot be empty')], // TODO: validtion
        username: [
          values.username,
          validators.required('username cannot be empty')
        ],
        password: [
          values.password,
          validators.required('password cannot be empty')
        ],
        role: [values.role as UserRole | undefined]
      });
    }, [initialValues]);

    const { values, errors, handler, isValid, resetForm } = useForm(form);
    const asyncFn = () =>
      isValid()
        ? apiRequest({ id, ...values }).then(res => res.data.data)
        : Promise.reject();

    const onSuccess = useCallback(
      (user: Schema$User) => dispatch(action(user)),
      [dispatch, action]
    );

    return (
      <AsyncFnDialog
        {...props}
        asyncFn={asyncFn}
        onClosed={resetForm}
        onSuccess={onSuccess}
        intent={Intent.PRIMARY}
      >
        <FormControl label="Email" error={errors.email}>
          <InputGroup
            value={values.email}
            onChange={handler.email.handleChange}
          />
        </FormControl>
        <FormControl label="Username" error={errors.username}>
          <InputGroup
            value={values.username}
            onChange={handler.username.handleChange}
          />
        </FormControl>
        <FormControl label="Password" error={errors.password}>
          <InputGroup
            value={values.password}
            onChange={handler.password.handleChange}
          />
        </FormControl>
        <FormControl label="User Role" error={errors.role}>
          <HTMLSelect value={values.role} onChange={handler.role.handleChange}>
            <option value="">Select user role &nbsp;</option>
            <option value={UserRole.ADMIN}>Admin</option>
            <option value={UserRole.GENERAL}>General</option>
            <option value={UserRole.CLIENT}>Client</option>
          </HTMLSelect>
        </FormControl>
      </AsyncFnDialog>
    );
  }
);
