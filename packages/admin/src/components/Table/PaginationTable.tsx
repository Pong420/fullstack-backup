import React from 'react';
import { Spinner } from '@blueprintjs/core';
import { Table, TableProps } from './Table';
import { NotFound, NotFoundProps } from '../NonIdealState';
import { Pagination, PaginationProps } from '../Pagination';

export interface PaginationTableProps<T extends object>
  extends TableProps<T>,
    NotFoundProps {
  pagination?: PaginationProps;
  loading?: boolean;
}

export function PaginationTable<T extends object>({
  pagination,
  loading,
  data,
  className = '',
  ...props
}: PaginationTableProps<T>) {
  const { onPageChange = () => {}, ...paginateProps } = pagination || {};

  return (
    <>
      <div className={`pagination-table ${className}`.trim()}>
        <Table data={data} {...props} />
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
