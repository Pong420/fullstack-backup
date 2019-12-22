import React from 'react';
import {
  Button,
  InputGroup,
  IInputGroupProps,
  HTMLInputProps
} from '@blueprintjs/core';
import { useBoolean } from '@fullstack/common/hooks/useBoolean';

interface Props
  extends IInputGroupProps,
    Omit<HTMLInputProps, 'value' | 'defaultValue' | 'onChange'> {
  visible?: boolean;
}

export const Password = React.memo<Props>(
  ({ className = '', visible = false, autoComplete, ...props }) => {
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
);
