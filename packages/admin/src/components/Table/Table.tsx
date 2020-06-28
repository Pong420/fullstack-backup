import React from 'react';
import { HTMLTable } from '@blueprintjs/core';
import { useTable, TableOptions } from 'react-table';

export * from 'react-table';

export interface TableProps<T extends object> extends TableOptions<T> {
  className?: string;
}

export function Table<T extends object>({
  className = '',
  ...props
}: TableProps<T>) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(props);

  return (
    <HTMLTable {...getTableProps()} className={className} striped>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </HTMLTable>
  );
}
