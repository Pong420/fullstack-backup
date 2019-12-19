import React, { useState, useEffect } from 'react';
import { Spinner } from '@blueprintjs/core';
import { Table, TableProps } from './Table';
import { NotFound, NotFoundProps } from '../NonIdealState';
import { Pagination, PaginationProps } from '../Pagination';

interface Props<T extends object> extends TableProps<T>, NotFoundProps {
  pagination?: PaginationProps;
  loading?: boolean;
}

export function PaginationTable<T extends object>({
  pagination,
  loading,
  data,
  ...props
}: Props<T>) {
  const [localData, setLocalData] = useState(data);
  const { onPageChange = () => {}, ...paginateProps } = pagination || {};

  useEffect(() => setLocalData(data), [data]);

  return (
    <>
      <div className="pagination-table">
        <Table data={localData} {...props} />
        {!loading && data.length === 0 && <NotFound />}
        {loading && (
          <div className="loading">
            <Spinner size={40} />
          </div>
        )}
      </div>
      <Pagination {...paginateProps} onPageChange={onPageChange} />
    </>
  );
}
