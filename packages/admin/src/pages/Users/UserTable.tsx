import React, { useMemo } from 'react';
import { ButtonGroup } from '@blueprintjs/core';
import { Schema$User, UserRole, isNotEmpty } from '@fullstack/typings';
import { PaginationTable, PaginationTableProps } from '../../components/Table';
import { Avatar } from '../../components/Avatar';
import { DeleteUser, OnDelete } from './DeleteUser';
import { UpdateUser, OnUpdate } from './UpdateUser';
import dayjs from 'dayjs';

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
  onUpdate,
  onDelete,
  ...props
}: Omit<Props, 'columns'> & OnDelete & OnUpdate) {
  const columns = useMemo(
    () => [
      ...userColumns,
      {
        Header: 'Actions',
        accessor: data =>
          isNotEmpty(data) && (
            <ButtonGroup>
              <UpdateUser {...data} onUpdate={onUpdate} />
              <DeleteUser
                id={data.id}
                nickname={data.nickname}
                onDelete={onDelete}
              />
            </ButtonGroup>
          )
      }
    ],
    [onDelete, onUpdate]
  );

  return (
    <PaginationTable {...props} className="user-table" columns={columns} />
  );
}
