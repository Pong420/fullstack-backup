import React from 'react';
import dayjs from 'dayjs';
import { Card } from '@blueprintjs/core';
import { Schema$User, UserRole } from '@fullstack/typings';
import { Layout } from '../../components/Layout';
import { PaginationTable, Column } from '../../components/Table';

const columns: Column<Partial<Schema$User>>[] = [
  {
    Header: 'Avatar'
  },
  {
    Header: 'Username',
    accessor: 'username'
  },
  {
    Header: 'Role',
    accessor: ({ role }) => {
      if (role) {
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
  return (
    <Layout className="users">
      <Card>
        <PaginationTable data={[]} columns={columns} loading />
      </Card>
    </Layout>
  );
}
