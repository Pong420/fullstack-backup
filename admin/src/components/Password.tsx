import React from 'react';
import { InputGroup, IInputGroupProps, Button } from '@blueprintjs/core';
import { useBoolean } from '../hooks/useBoolean';

interface Props extends IInputGroupProps {
  visible?: boolean;
}

export const Password = React.memo<Props>(
  ({ className = '', visible = false, ...props }) => {
    const [isVisible, setVisible] = useBoolean(visible);
    return (
      <InputGroup
        {...props}
        className={`password ${className}`.trim()}
        type={isVisible ? '' : 'password'}
        rightElement={
          <Button
            minimal
            icon={isVisible ? 'eye-off' : 'eye-open'}
            onClick={setVisible.toggle}
          />
        }
      />
    );
  }
);
