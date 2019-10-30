import React, { useMemo, useCallback, Dispatch } from 'react';
import { useDispatch } from 'react-redux';
import { AxiosPromise } from 'axios';
import { Intent, InputGroup, HTMLSelect } from '@blueprintjs/core';
import { AsyncFnDialog, AsyncFnDialogProps } from '../Dialog';
import { FormControl } from '../FormControl';
import { FormBuilder, useForm } from '../../hooks/useForm';
import {
  Role,
  Param$CreateUser,
  Schema$User,
  Response$API
} from '../../typings';
import { UserActions } from '../../store';
import * as validators from '../../utils/validators';

interface Fields extends Param$CreateUser {
  role?: Role;
}

const defaultValue: Fields = {
  username: '',
  password: '',
  role: undefined
};

interface Props extends Omit<AsyncFnDialogProps, 'asyncFn'> {
  initialValues?: Partial<Fields>;
  action: (user: Schema$User) => UserActions;
  apiRequest: (fields: Fields) => AxiosPromise<Response$API<Schema$User>>;
}

export const UserDialog = React.memo(
  ({ initialValues, action, apiRequest, ...props }: Props) => {
    const dispatch = useDispatch<Dispatch<UserActions>>();

    const form = useMemo(() => {
      const values = { ...defaultValue, ...initialValues };
      return FormBuilder({
        username: [
          values.username,
          validators.required('Product name cannot be empty')
        ],
        password: [
          values.password,
          validators.required('Password cannot be empty')
        ],
        role: [values.role as Role | undefined]
      });
    }, [initialValues]);

    const { values, errors, handler, isValid, resetForm } = useForm(form);
    const asyncFn = () =>
      isValid()
        ? apiRequest(values).then(res => res.data.data)
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
        <FormControl label="Role" error={errors.role}>
          <HTMLSelect value={values.role} onChange={handler.role.handleChange}>
            <option value="">Select a role &nbsp;</option>
            <option value={Role.ADMIN}>Admin</option>
            <option value={Role.GENERAL}>General</option>
          </HTMLSelect>
        </FormControl>
      </AsyncFnDialog>
    );
  }
);
