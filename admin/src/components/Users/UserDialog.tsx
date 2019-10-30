import React, { useMemo } from 'react';
import { Intent, InputGroup, HTMLSelect } from '@blueprintjs/core';
import { AsyncFnDialog, AsyncFnDialogProps } from '../Dialog';
import { FormControl } from '../FormControl';
import { FormBuilder, useForm } from '../../hooks/useForm';
import { Role, Param$CreateUser } from '../../typings';
import { createUser } from '../../services';
import * as validators from '../../utils/validators';

interface Fields extends Param$CreateUser {}

const defaultValue: Fields = {
  username: '',
  password: '',
  role: ''
};

interface Props extends Omit<AsyncFnDialogProps, 'asyncFn'> {
  initialValues?: Partial<Fields>;
}

export const UserDialog = React.memo(({ initialValues, ...props }: Props) => {
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
      role: [values.role]
    });
  }, [initialValues]);

  const { values, errors, handler, isValid, resetForm } = useForm(form);
  const asyncFn = () => (isValid() ? createUser(values) : Promise.reject());

  return (
    <AsyncFnDialog
      {...props}
      onClosed={resetForm}
      asyncFn={asyncFn}
      intent={Intent.PRIMARY}
    >
      <FormControl label="Username" error={errors.username}>
        <InputGroup
          readOnly
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
});
