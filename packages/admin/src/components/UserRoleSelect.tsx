import React, { ComponentProps } from 'react';
import { HTMLSelect } from '@blueprintjs/core';
import { UserRole } from '@fullstack/typings';

const entries = Object.entries(UserRole).filter(([k, v]) => !isNaN(Number(v)));

export function UserRoleSelect(props: ComponentProps<typeof HTMLSelect>) {
  return (
    <HTMLSelect fill {...props}>
      <option>Select user role</option>
      {entries.map(([label, value]) => (
        <option key={label} value={value}>
          {label[0] + label.slice(1).toLowerCase()}
        </option>
      ))}
    </HTMLSelect>
  );
}
