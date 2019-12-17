import React, { ReactNode } from 'react';
import { RxFileToImageState } from 'use-rx-hooks';
import { InputGroup, TextArea, Checkbox } from '@blueprintjs/core';
import { NumericInput } from '../../components/NumericInput';
import { ImageUploadGrid } from '../../components/ImageUploadGrid';
import { ProductTypesInput, ProductTagsInput } from './ProductFormSuggest';
import { Param$CreateProduct, ProductStatus } from '../../typings';
import { createForm, FormInstance, validators } from '../../utils/form';

type Fields = Omit<Param$CreateProduct, 'images'> & {
  images: Array<RxFileToImageState | string>;
};

export interface ProductFormProps {
  form?: FormInstance<Fields>;
  initialValues?: Partial<Fields>;
  onSubmit: (values: Param$CreateProduct) => void;
  children?: ReactNode;
}

const { Form, FormItem, useForm } = createForm<Fields>();

export const useProductForm = useForm;

const defaultValues: Fields = {
  name: '',
  price: 0,
  amount: 0,
  type: '',
  images: [],
  tags: [],
  description: '',
  status: ProductStatus.VISIBLE
};

export function ProductForm({
  form: _form,
  onSubmit,
  initialValues,
  children
}: ProductFormProps) {
  const [form] = useForm(_form);

  return (
    <Form
      className="product-form"
      form={form}
      initialValues={{ ...defaultValues, ...initialValues }}
      onFinish={({ images, ...store }) => {
        onSubmit({
          ...store,
          images: images.map(payload =>
            typeof payload === 'string' ? payload : payload.file
          )
        });
      }}
    >
      <FormItem
        name="name"
        label="Product Name"
        validators={[validators.required('Product name cannot be empty')]}
      >
        <InputGroup />
      </FormItem>

      <FormItem
        name="price"
        label="Price"
        validators={[validators.min(1, 'Pice cannot less then 1', true)]}
      >
        <NumericInput fill min={0} />
      </FormItem>

      <FormItem
        name="amount"
        label="Amount"
        validators={[validators.min(1, 'Amount cannot less then 1', true)]}
      >
        <NumericInput fill min={0} />
      </FormItem>

      <FormItem
        name="type"
        label="Type"
        valuePropName="value"
        validators={[validators.required('Product name cannot be empty')]}
      >
        <ProductTypesInput />
      </FormItem>

      <FormItem name="images" label="Images">
        <ImageUploadGrid />
      </FormItem>

      <FormItem name="tags" label="Tags">
        <ProductTagsInput />
      </FormItem>

      <FormItem name="description" label="Description">
        <TextArea fill rows={4} />
      </FormItem>

      <FormItem
        className="hidden"
        name="status"
        valuePropName="checked"
        normalize={checked =>
          checked ? ProductStatus.HIDDEN : ProductStatus.VISIBLE
        }
      >
        <Checkbox alignIndicator="right" children="Hidden" />
      </FormItem>

      <button type="submit" hidden></button>

      {children}
    </Form>
  );
}
