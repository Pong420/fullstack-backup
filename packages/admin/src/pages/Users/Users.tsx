import React from 'react';
import { Card } from '@blueprintjs/core';
import { Schema$User } from '@fullstack/typings';
import { Layout } from '../../components/Layout';
import { UserTable } from './UserTable';
import { usePaginationLocal } from '../../hooks/usePaginationLocal';
import { getUsers } from '../../service';
import { Toaster } from '../../utils/toaster';

const onFailure = Toaster.apiError.bind(Toaster, 'Get users failure');

export function Users() {
  const { data, loading, pagination } = usePaginationLocal<Schema$User, 'id'>({
    key: 'id',
    onFailure,
    fn: getUsers
  });

  return (
    <Layout className="users">
      <Card>
        <UserTable data={data} loading={loading} pagination={pagination} />
      </Card>
    </Layout>
  );
}
