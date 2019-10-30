import React from 'react';
import { Card } from '@blueprintjs/core';
import { Column } from 'react-table';
import { useRxAsync } from 'use-rx-hooks';
import { Layout } from '../Layout';
import { Table } from '../Table';
import { CreateUser } from './CreateUser';
import { UserControls } from './UserControls';
import { Schema$User } from '../../typings';
import { getUsers } from '../../services';
import dayjs from 'dayjs';

const columns: Column<Schema$User>[] = [
  {
    Header: 'Username',
    accessor: 'username'
  },
  { Header: 'Role', accessor: 'role' },
  {
    Header: 'Created At',
    accessor: ({ createdAt }) => dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'constrols',
    Cell: ({ cell }) => <UserControls {...cell.row.original} />
  }
];

const getUsersHoc = () => getUsers().then(res => res.data.data);

export function Users() {
  const { data } = useRxAsync(getUsersHoc);

  return (
    <Layout className="users" title="Users" navbar={<CreateUser />}>
      {data && (
        <Card>
          <Table data={data} columns={columns} />
        </Card>
      )}
    </Layout>
  );
}
