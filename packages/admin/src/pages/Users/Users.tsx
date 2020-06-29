import React from 'react';
import { Card } from '@blueprintjs/core';
import { Schema$User, Param$GetUsers } from '@fullstack/typings';
import { Layout } from '../../components/Layout';
import { createFilter } from '../../components/Filter';
import { UserTable } from './UserTable';
import { usePaginationLocal } from '../../hooks/usePaginationLocal';
import { getUsers } from '../../service';
import { Toaster } from '../../utils/toaster';
import { UserRoleSelect } from '../../components/UserRoleSelect';

const onFailure = Toaster.apiError.bind(Toaster, 'Get users failure');

const {
  Filter, //
  FilterInput,
  FormItem,
  FilterDateRange
} = createFilter<Param$GetUsers>();

export function Users() {
  const { data, loading, pagination, params } = usePaginationLocal<
    Schema$User,
    'id'
  >({
    key: 'id',
    onFailure,
    fn: getUsers
  });

  return (
    <Layout
      className="users"
      navbar={
        <Filter initialValues={params}>
          <FilterInput name="search" label="Search" />
          <FilterInput name="username" label="Username" />
          <FilterInput name="email" label="Email" />
          <FilterInput name="nickname" label="Nickname" />
          <FormItem name="role" label="Role">
            <UserRoleSelect />
          </FormItem>
          <FilterDateRange name="createdAt" label="Created At" />
        </Filter>
      }
    >
      <Card>
        <UserTable data={data} loading={loading} pagination={pagination} />
      </Card>
    </Layout>
  );
}
