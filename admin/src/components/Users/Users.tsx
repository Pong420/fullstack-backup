import React from 'react';
import { Card, ButtonGroup } from '@blueprintjs/core';
import { Column } from 'react-table';
import { Layout } from '../Layout';
import { Table } from '../Table';
import { ButtonPopover } from '../ButtonPopover';
import { Schema$User } from '../../typings';

const data: Schema$User[] = new Array(20).fill({
  username: 'foo',
  role: 'admin',
  createdAt: '2019-10-25T13:56:45.767Z',
  updatedAt: '2019-10-25T13:56:45.767Z',
  id: '5db2ff1d2802cb618a6a6f15'
});

const columns: Column<Schema$User>[] = [
  {
    Header: 'Username',
    accessor: 'username'
  },
  { Header: 'Role', accessor: 'role' },
  {
    Header: 'Created At',
    accessor: ({ createdAt }) => new Date(createdAt)
  },
  {
    id: 'constrols',
    Cell: () => (
      <ButtonGroup>
        <ButtonPopover icon="info-sign" content="More info" />
        <ButtonPopover icon="edit" content="Edit" />
        <ButtonPopover icon="trash" content="Remove" />
      </ButtonGroup>
    )
  }
];

export function Users() {
  return (
    <Layout className="users" title="Users">
      <Card>
        <Table data={data} columns={columns} />
      </Card>
    </Layout>
  );
}
