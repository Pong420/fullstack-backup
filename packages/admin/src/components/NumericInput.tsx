import React from 'react';
import {
  NumericInput as Bp3NumericInput,
  INumericInputProps
} from '@blueprintjs/core';

export interface NumericInputProps
  extends Omit<INumericInputProps, 'onValueChange'> {
  onChange?: (input: number | string) => void;
}

export const NumericInput = React.memo<NumericInputProps>(
  ({ onChange, ...props }) => (
    <Bp3NumericInput
      {...props}
      clampValueOnBlur
      onValueChange={(valueAsNumber: number, valueAsString: string) => {
        onChange && onChange(valueAsNumber || valueAsString);
      }}
    />
  )
);
