import React from 'react';
import {
  NumericInput as Bp3NumericInput,
  INumericInputProps
} from '@blueprintjs/core';

export interface NumericInputProps
  extends Omit<INumericInputProps, 'onValueChange'> {
  onChange?: INumericInputProps['onValueChange'];
}

export const NumericInput = React.memo<NumericInputProps>(
  ({ onChange, ...props }) => (
    <Bp3NumericInput {...props} onValueChange={onChange} />
  )
);
