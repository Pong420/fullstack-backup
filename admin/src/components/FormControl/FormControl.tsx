import React, { ReactNode } from 'react';
import { IFormGroupProps, Classes } from '@blueprintjs/core';

interface FormControlProps extends IFormGroupProps {
  error?: string;
  children: ReactNode;
}

// The official `FormGroup` component cause rerender, so use corresponds class name instead.
export const FormControl = React.memo(
  ({ error, children, helperText, label, labelInfo }: FormControlProps) => {
    return (
      <div
        className={`
          form-control 
          ${Classes.FORM_GROUP} 
          ${error ? Classes.INTENT_DANGER : ''}`.trim()}
      >
        <label className={Classes.LABEL}>
          {label} <span className={Classes.TEXT_MUTED}>{labelInfo}</span>
        </label>
        <div className={Classes.FORM_CONTENT}>
          {children}
          <div className={Classes.FORM_HELPER_TEXT}>{error || helperText}</div>
        </div>
      </div>
    );
  }
);
