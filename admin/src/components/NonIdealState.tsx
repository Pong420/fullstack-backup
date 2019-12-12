import React from 'react';
import { NonIdealState, Button } from '@blueprintjs/core';

export interface NotFoundProps {
  onClear?: () => void;
}

export const NotFound = React.memo<NotFoundProps>(({ onClear }) => {
  return (
    <NonIdealState
      icon="search"
      title="No results found"
      description={
        <>
          <div>Your search didn't match any results.</div>
          <div>Try searching for something else.</div>
        </>
      }
      action={
        onClear && (
          <Button intent="primary" onClick={onClear}>
            Clear Search
          </Button>
        )
      }
    />
  );
});
