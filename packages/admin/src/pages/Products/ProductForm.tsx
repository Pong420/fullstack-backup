import React from 'react';
import { Checkbox } from '@blueprintjs/core';
import { Schema$Product, Param$CreateProduct } from '@fullstack/typings';
import { Input, NumericInput, TextArea } from '../../components/Input';
import { UploadImageGrid } from '../../components/UploadImage';
import { createForm, validators, FormProps } from '../../utils/form';
import { ProductTagsInput, ProductCategoryInput } from './ProductFormSuggest';

type Schema = Partial<Omit<Schema$Product, 'images'>> &
  Param$CreateProduct & {
    images?: unknown[];
  };

const { Form, FormItem, useForm } = createForm<Schema>();

const initialValues: Partial<Schema> = {
  discount: 100,
  hidden: false
};

export { useForm };

export function ProductForm(props: FormProps<Schema>) {
  return (
    <Form {...props} className="product-form" initialValues={initialValues}>
      <FormItem
        name="name"
        label="Name"
        validators={[
          validators.required('Product name cannot be empty')
          //
        ]}
      >
        <Input autoFocus />
      </FormItem>

      <FormItem
        name="price"
        label="Price"
        validators={[
          validators.required('Price cannot be empty'),
          validators.number,
          validators.min(0, 'Price cannot less than or equal to 0')
        ]}
      >
        <NumericInput min={0} stepSize={1} />
      </FormItem>

      <FormItem
        name="amount"
        label="Amount"
        validators={[
          validators.required('Amount cannot be empty'),
          validators.number,
          validators.min(1, 'Amount cannot less then 1', true)
        ]}
      >
        <NumericInput min={0} stepSize={1} />
      </FormItem>

      <FormItem
        name="category"
        label="Category"
        validators={[
          validators.required('Category cannot be empty')
          //
        ]}
      >
        <ProductCategoryInput />
      </FormItem>

      <FormItem name="images" label="Images">
        <UploadImageGrid />
      </FormItem>

      <FormItem name="tags" label="tags">
        <ProductTagsInput />
      </FormItem>

      <FormItem
        name="discount"
        label="Discount"
        validators={[
          validators.number,
          validators.min(0, 'Discount cannot less than 0', true),
          validators.max(100, 'Discount cannot greater than 100', true)
        ]}
      >
        <NumericInput min={0} max={100} stepSize={1} />
      </FormItem>

      <FormItem name="description" label="Description">
        <TextArea rows={4} />
      </FormItem>

      <FormItem name="hidden" valuePropName="checked">
        <Checkbox children="Hidden" alignIndicator="right" />
      </FormItem>

      <button type="submit" hidden />
    </Form>
  );
}
