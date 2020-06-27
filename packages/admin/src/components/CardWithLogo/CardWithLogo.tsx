import React from 'react';
import { Card, H5, ICardProps } from '@blueprintjs/core';
import { ReactComponent as Logo } from '../../assets/logo.svg';

export function CardWithLogo({
  title,
  children,
  elevation = 2,
  ...props
}: ICardProps) {
  return (
    <Card {...props} className="card-with-logo" elevation={elevation}>
      <div className="card-with-logo-header">
        <Logo />
        <H5 children={title} />
      </div>
      <div className="card-with-logo-body">{children}</div>
    </Card>
  );
}
