import React from 'react';
import dayjs from 'dayjs';
import { Schema$User, UserRole } from '@fullstack/typings';
import { PaginationTable, PaginationTableProps } from '../../components/Table';
import { Avatar } from '../../components/Avatar';

type Props = PaginationTableProps<Partial<Schema$User>>;

const columns: Props['columns'] = [
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
  },
  {
    Header: 'Actions',
    accessor: () => {
      return null;
    }
  }
];

export function UserTable(props: Omit<Props, 'columns'>) {
  return <PaginationTable {...props} columns={columns} />;
}
