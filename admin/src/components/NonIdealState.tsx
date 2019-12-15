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
        <Button
          intent="primary"
          onClick={onClear}
          style={{ visibility: onClear ? 'visible' : 'hidden' }}
        >
          Clear Search
        </Button>
      }
    />
  );
});
