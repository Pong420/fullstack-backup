import React from 'react';
import { Card } from '@blueprintjs/core';
import { Layout } from '../../components/Layout';
import { PaginationTable, Column } from '../../components/Table';
import { Avatar } from '../../components/Avatar';
import { Omnibar } from '../../components/Omnibar';
import { CreateUser } from './CreateUser';
import { UserControls } from './UserControls';
import { Schema$User } from '../../typings';
import { getUsers as getUsersAPI } from '../../services';
import { useUserActions, userPaginationSelector } from '../../store';
import { useReduxPagination } from '../../hooks/useReduxPagination';
import dayjs from 'dayjs';

const columns: Column<Partial<Schema$User>>[] = [
  {
    Header: 'Avatar',
    Cell: ({
      row: {
        original: { avatar, username }
      }
    }) => <Avatar avatar={avatar} fallback={username} />
  },
  {
    Header: 'Username',
    accessor: 'username'
  },
  {
    Header: 'Role',
    accessor: ({ role }) =>
      role && role.slice(0, 1).toUpperCase() + role.slice(1, role.length)
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
    Cell: ({ row }) => {
      return <UserControls {...row.original} />;
    }
  }
];

export const Users = () => {
  const { paginateUser } = useUserActions();

  const [{ data, loading }, paginationtProps] = useReduxPagination({
    fn: getUsersAPI,
    onSuccess: paginateUser,
    selector: userPaginationSelector
  });

  return (
    <Layout
      className="users"
      icon="user"
      title="Users"
      navbar={
        <>
          <CreateUser />
          <Omnibar suffix="User" />
        </>
      }
    >
      <Card>
        <PaginationTable
          data={data}
          loading={loading}
          columns={columns}
          pagination={paginationtProps}
        />
      </Card>
    </Layout>
  );
};
