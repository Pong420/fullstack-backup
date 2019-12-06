import React, { useEffect } from 'react';
import { Card } from '@blueprintjs/core';
import { Column } from 'react-table';
import { useSelector } from 'react-redux';
import { useRxAsync } from 'use-rx-hooks';
import { Layout } from '../Layout';
import { Table } from '../Table';
import { Avatar } from '../Avatar';
import { CreateUser } from './CreateUser';
import { UserControls } from './UserControls';
import { addUser, resetUsers, userListSelector } from '../../store';
import { Schema$User } from '../../typings';
import { getUsers as getUsersAPI } from '../../services';
import { useActions } from '../../hooks/useActions';
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

const getUsers_ = () => getUsersAPI().then(res => res.data.data);
const onFailure = (error: any) => Toaster.apiError(error);
const actions = { resetUsers, addUser };

export function Users() {
  const { resetUsers, addUser } = useActions(actions);
  const users = useSelector(userListSelector);

  useEffect(resetUsers, []);

  useRxAsync(getUsers_, {
    onSuccess: addUser,
    onFailure
  });

  return (
    <Layout className="users" title="Users" navbar={<CreateUser />}>
      {!!users.length && (
        <Card>
          <Table data={users} columns={columns} />
        </Card>
      )}
    </Layout>
  );
}
