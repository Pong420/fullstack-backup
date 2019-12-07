import React, { useEffect, useCallback, useState } from 'react';
import { Card } from '@blueprintjs/core';
import { Column } from 'react-table';
import { useSelector } from 'react-redux';
import { useRxAsync } from 'use-rx-hooks';
import { Layout } from '../Layout';
import { Table, PaginationTable } from '../Table';
import { Pagination } from '../Pagination';
import { Avatar } from '../Avatar';
import { CreateUser } from './CreateUser';
import { UserControls } from './UserControls';
import { userListSelector, useUserActions } from '../../store';
import { Schema$User } from '../../typings';
import { getUsers as getUsersAPI } from '../../services';
import { Toaster } from '../../utils/toaster';
import dayjs from 'dayjs';

const columns: Column<Schema$User>[] = [
  {
    Header: 'Avatar',
    Cell: ({
      cell: {
        row: {
          original: { avatar, username }
        }
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
    accessor: ({ createdAt }) => dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    Header: 'Controls',
    Cell: ({ cell }) => <UserControls {...cell.row.original} />
  }
];

const pageSize = 10;
const onFailure = (error: any) => Toaster.apiError(error);

const navbar = <CreateUser />;

export function Users() {
  const { resetUsers, addUser } = useUserActions();
  const [pageNo, setPageNo] = useState(1);
  const [total, setTotal] = useState(0);
  const users = useSelector(userListSelector);

  const request = useCallback(
    () =>
      getUsersAPI({ pageNo, pageSize }).then(res => {
        const { docs, totalDocs } = res.data.data;
        addUser(docs);
        setTotal(totalDocs);
        return docs;
      }),
    [pageNo, addUser]
  );

  // TODO: remove ?
  useEffect(resetUsers, []);

  const { data, loading } = useRxAsync(request, {
    onFailure
  });

  return (
    <Layout className="users" title="Users" navbar={navbar}>
      {!!users.length && (
        <Card>
          <PaginationTable
            loading={loading}
            data={data || []}
            columns={columns}
            pagination={{ total, onPageChange: setPageNo }}
          />
        </Card>
      )}
    </Layout>
  );
}
