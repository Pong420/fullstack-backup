import React from 'react';
import { Button, Checkbox } from '@blueprintjs/core';
import { Schema$Product } from '@fullstack/typings';
import { Input, NumericInput, TextArea } from '../../components/Input';
import { UploadImageGrid } from '../../components/UploadImage';
import { createForm, validators } from '../../utils/form';

type Schema = Partial<Schema$Product>;

const { Form, FormItem } = createForm<Schema>();

const initialValues: Schema = {
  discount: 100,
  hidden: false
};

export function ProductForm() {
  return (
    <Form className="product-form" initialValues={initialValues}>
      <FormItem
        name="name"
        label="Name"
        validators={[
          validators.required('Product name cannot be empty')
          //
        ]}
      >
        <Input />
      </FormItem>

      <FormItem
        name="price"
        label="Price"
        validators={[
          validators.required('Price cannot be empty'),
          validators.number,
          validators.min(0, 'Price less than or equal to 0')
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
        <Input />
      </FormItem>

      <FormItem name="images" label="Images">
        <UploadImageGrid />
      </FormItem>

      <FormItem name="tags" label="tags">
        <Input />
      </FormItem>

      <FormItem
        name="discount"
        label="Discount"
        validators={[
          validators.number,
          validators.min(0, 'Price less than 0', true),
          validators.max(100, 'Price greater than 100', true)
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

      <Button type="submit" fill>
        Submit
      </Button>
    </Form>
  );
}
