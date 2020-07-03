import React from 'react';
import {
  Button,
  InputGroup,
  TextArea as BpTextArea,
  NumericInput as BpNumericInput,
  ITextAreaProps,
  IInputGroupProps,
  INumericInputProps,
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
  return (
    <InputGroup
      fill
      autoComplete="off"
      {...props}
      {...(props &&
        props.onChange &&
        typeof props.value === 'undefined' && { value: '' })}
    />
  );
}

export function TextArea(props?: ITextAreaProps) {
  return (
    <BpTextArea
      fill
      autoComplete="off"
      {...props}
      {...(props &&
        props.onChange &&
        typeof props.value === 'undefined' && { value: '' })}
    />
  );
}

export function NumericInput({
  onValueChange,
  onChange,
  ...props
}: INumericInputProps & { onChange?: (payload: unknown) => void } = {}) {
  return (
    <BpNumericInput
      fill
      clampValueOnBlur
      autoComplete="off"
      allowNumericCharactersOnly={false}
      {...props}
      {...(props &&
        onChange &&
        typeof props.value === 'undefined' && { value: '' })}
      onValueChange={(num, raw) => onChange && onChange(isNaN(num) ? raw : num)}
    />
  );
}

export function Password({
  className = '',
  visible = false,
  autoComplete,
  ...props
}: PasswordProps) {
  const [isVisible, , , toggleVisible] = useBoolean(visible);
  return (
    <Input
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
