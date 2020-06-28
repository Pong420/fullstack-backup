import React from 'react';
import { NonIdealState } from '@blueprintjs/core';

export interface NotFoundProps {}

export const NotFound = React.memo<NotFoundProps>(() => {
  return <NonIdealState icon="search" title="No results found" />;
});
