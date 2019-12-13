import React, { ReactNode } from 'react';
import { RxFileToImageState } from 'use-rx-hooks';
import { InputGroup, TagInput, TextArea, Checkbox } from '@blueprintjs/core';
import { NumericInput } from '../../components/NumericInput';
import { ImageUploadGrid } from '../../components/ImageUploadGrid';
import { Param$CreateProduct } from '../../typings';
import { createForm, FormInstance } from '../../utils/form';

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
  hidden: false
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
        // validators={[validators.required('Please input product name')]}
      >
        <InputGroup />
      </FormItem>

      <FormItem name="price" label="Price">
        <NumericInput fill min={0} leftIcon="dollar" />
      </FormItem>

      <FormItem name="amount" label="Amount">
        <NumericInput fill min={0} />
      </FormItem>

      <FormItem name="type" label="Type">
        <InputGroup />
      </FormItem>

      <FormItem name="images" label="Images">
        <ImageUploadGrid />
      </FormItem>

      <FormItem name="tags" label="Tags" valuePropName="values">
        <TagInput />
      </FormItem>

      <FormItem name="description" label="Description">
        <TextArea fill rows={4} />
      </FormItem>

      <FormItem name="hidden" valuePropName="checked">
        <Checkbox>Hidden</Checkbox>
      </FormItem>

      {/* TODO: TBC */}
      {/* Do not use input or button element with type `submit` */}
      {/* Because this may trigger submit while adding tags */}
      {/* <button type="submit" hidden></button> */}

      {children}
    </Form>
  );
}
