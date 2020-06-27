import React from 'react';
import {
  Button,
  InputGroup,
  IInputGroupProps,
  HTMLInputProps
} from '@blueprintjs/core';
import { useBoolean } from '../hooks/useBoolean';

interface InputProps
  extends IInputGroupProps,
    Omit<HTMLInputProps, 'value' | 'defaultValue' | 'onChange'> {}

interface PasswordProps extends InputProps {
  visible?: boolean;
}

export function Input(props?: InputProps) {
  return <InputGroup autoComplete="off" {...props} />;
}

export function Password({
  className = '',
  visible = false,
  autoComplete,
  ...props
}: PasswordProps) {
  const [isVisible, , , toggleVisible] = useBoolean(visible);
  return (
    <InputGroup
      {...props}
      autoComplete={autoComplete === 'off' ? 'new-password' : autoComplete}
      className={`password ${className}`.trim()}
      type={isVisible ? '' : 'password'}
      rightElement={
        <Button
          minimal
          icon={isVisible ? 'eye-off' : 'eye-open'}
          onClick={toggleVisible}
        />
      }
    />
  );
}
