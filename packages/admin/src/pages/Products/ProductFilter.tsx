import React, { ComponentProps } from 'react';
import { Param$GetProducts } from '@fullstack/typings';
import { createFilter } from '../../components/Filter';
import { NumericRangeInput } from '../../components/Input';
import { ProductTagsInput, ProductCategoryInput } from './ProductFormSuggest';

const {
  Filter, //
  FilterInput,
  FormItem,
  FilterDateRange
} = createFilter<Param$GetProducts>();

export function ProductFilter(props: ComponentProps<typeof Filter>) {
  return (
    <Filter {...props}>
      <FilterInput name="name" label="Name" />

      <FormItem name="category" label="Category">
        <ProductCategoryInput />
      </FormItem>

      <FormItem name="tags" label="tags">
        <ProductTagsInput />
      </FormItem>

      <FormItem name="price" label="Price">
        <NumericRangeInput />
      </FormItem>

      <FormItem name="amount" label="Amount">
        <NumericRangeInput />
      </FormItem>

      <FormItem name="freeze" label="Frezze">
        <NumericRangeInput />
      </FormItem>

      <FormItem name="remain" label="Remain">
        <NumericRangeInput />
      </FormItem>

      <FormItem name="discount" label="Discount">
        <NumericRangeInput />
      </FormItem>

      <FilterDateRange name="createdAt" label="Created At" />
      <FilterDateRange name="updatedAt" label="Updated At" />
    </Filter>
  );
}
