import React, { useState, useEffect } from 'react';
import { Spinner } from '@blueprintjs/core';
import { Table, TableProps } from './Table';
import { Pagination, PaginationProps } from '../Pagination';

interface Props<T extends object> extends TableProps<T> {
  pagination?: PaginationProps;
  loading?: boolean;
}

// TODO: Not Found

export function PaginationTable<T extends object>({
  pagination,
  loading,
  data,
  ...props
}: Props<T>) {
  const [localData, setLocalData] = useState(data);
  const { total = 0, onPageChange = () => {}, ...paginateProps } =
    pagination || {};

  useEffect(() => setLocalData(data), [data]);

  return (
    <>
      <div className="pagination-table">
        <Table data={localData} {...props} />
        {loading && (
          <div className="loading">
            <Spinner size={40} />
          </div>
        )}
      </div>
      <Pagination
        {...paginateProps}
        total={total}
        onPageChange={onPageChange}
      />
    </>
  );
}
