import React from 'react';
import { Button, NonIdealState, INonIdealStateProps } from '@blueprintjs/core';
import { useLocation } from 'react-router-dom';
import { clearSearchParam } from '../utils/setSearchParam';

export interface NotFoundProps {}

export const NotFound = React.memo<NotFoundProps>(() => {
  const localtion = useLocation();
  const hasQuery = !!localtion.search.slice(1);
  const props: INonIdealStateProps = hasQuery
    ? {
        description: (
          <>
            <div>Your search didn't match any results.</div>
            <div>Try searching for something else.</div>
          </>
        ),
        action: (
          <Button intent="primary" onClick={clearSearchParam}>
            Clear Search
          </Button>
        )
      }
    : {};

  return <NonIdealState icon="search" title="No results found" {...props} />;
});
