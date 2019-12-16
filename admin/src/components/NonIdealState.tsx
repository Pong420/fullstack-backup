import React from 'react';
import { useSelector } from 'react-redux';
import { NonIdealState, Button } from '@blueprintjs/core';
import { searchParamSelector } from '../store';
import { useSearchParam } from '../hooks/useSearchParam';

export interface NotFoundProps {}

export const NotFound = React.memo<NotFoundProps>(() => {
  const { search } = useSelector(searchParamSelector);
  const { setSearchParam } = useSearchParam();

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
          onClick={() => setSearchParam({ search: undefined })}
          style={{ visibility: search ? 'visible' : 'hidden' }}
        >
          Clear Search
        </Button>
      }
    />
  );
});
