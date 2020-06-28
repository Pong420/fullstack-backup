import React from 'react';
import dayjs from 'dayjs';
import { Card } from '@blueprintjs/core';
import { Schema$User, UserRole } from '@fullstack/typings';
import { Layout } from '../../components/Layout';
import { PaginationTable, Column } from '../../components/Table';
import { Avatar } from '../../components/Avatar';
import { usePaginationLocal } from '../../hooks/usePaginationLocal';
import { getUsers } from '../../service/user';

const columns: Column<Partial<Partial<Schema$User>>>[] = [
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
    Header: 'Controls',
    Cell: () => {
      return null;
    }
  }
];

export function Users() {
  const { data, loading, pagination } = usePaginationLocal<Schema$User, 'id'>({
    key: 'id',
    fn: getUsers
  });

  return (
    <Layout className="users">
      <Card>
        <PaginationTable
          data={data}
          columns={columns}
          loading={loading}
          pagination={pagination}
        />
      </Card>
    </Layout>
  );
}
