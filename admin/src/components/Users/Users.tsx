import React from 'react';
import { Card } from '@blueprintjs/core';
import { Layout } from '../Layout';
import { PaginationTable, Column } from '../Table';
import { Avatar } from '../Avatar';
import { CreateUser } from './CreateUser';
import { UserControls } from './UserControls';
import { Schema$User } from '../../typings';
import { getUsers as getUsersAPI } from '../../services';
import { useUserActions, userPaginationSelector } from '../../store';
import { Toaster } from '../../utils/toaster';
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
    Header: 'Nickname',
    accessor: 'nickname'
  },
  {
    Header: 'Username',
    accessor: 'username'
  },
  { Header: 'Role', accessor: 'role' },
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

const onFailure = (error: any) => Toaster.apiError(error);

const navbar = <CreateUser />;

export function Users() {
  const { paginateUser, setPage } = useUserActions();

  const { data, total, pageNo, loading } = useReduxPagination({
    selector: userPaginationSelector,
    fn: getUsersAPI,
    onSuccess: paginateUser,
    onFailure
  });

  return (
    <Layout className="users" title="Users" navbar={navbar}>
      <Card>
        <PaginationTable
          data={data}
          loading={loading}
          columns={columns}
          pagination={{ total, pageNo, onPageChange: setPage }}
        />
      </Card>
    </Layout>
  );
}
