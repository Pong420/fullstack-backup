import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { Schema$User, UserRole } from '@fullstack/typings';
import { PaginationTable, PaginationTableProps } from '../../components/Table';
import { Avatar } from '../../components/Avatar';
import { DeleteUser, OnDelete } from './DeleteUser';

type Props = PaginationTableProps<Partial<Schema$User>>;
type Columns = Props['columns'];

const userColumns: Columns = [
  {
    Header: 'Avatar',
    accessor: ({ avatar, username }) => (
      <Avatar avatar={avatar} fallback={username} />
    )
  },
  {
    Header: 'Username',
    accessor: 'username'
  },
  {
    Header: 'Role',
    accessor: ({ role }) => {
      if (typeof role !== 'undefined') {
        const str = UserRole[role];
        return str[0] + str.slice(1).toLowerCase();
      }
    }
  },
  {
    Header: 'Nickname',
    accessor: 'nickname'
  },
  { Header: 'Email', accessor: 'email' },
  {
    Header: 'Created At',
    accessor: ({ createdAt }) =>
      createdAt && dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
  }
];

export function UserTable({
  onDelete,
  ...props
}: Omit<Props, 'columns'> & OnDelete) {
  const columns = useMemo(
    () => [
      ...userColumns,
      {
        Header: 'Actions',
        accessor: ({ id, nickname }) =>
          !!id &&
          !!nickname && (
            <>
              <DeleteUser id={id} nickname={nickname} onDelete={onDelete} />
            </>
          )
      }
    ],
    [onDelete]
  );

  return (
    <PaginationTable {...props} className="user-table" columns={columns} />
  );
}
