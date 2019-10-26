import React from 'react';
import { useTable, TableOptions } from 'react-table';

interface Props<T extends object> extends TableOptions<T> {
  className?: string;
}

export function Table<T extends object>({
  className = '',
  ...props
}: Props<T>) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(props);

  return (
    <table
      {...getTableProps()}
      className={`bp3-html-table ${className}`.trim()}
    >
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
        {rows.map(
          (row, i) =>
            // @ts-ignore
            prepareRow(row) || (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            )
        )}
      </tbody>
    </table>
  );
}
