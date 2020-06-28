import React, { useEffect, useRef } from 'react';
import { Button, Popover, H5 } from '@blueprintjs/core';
import { createForm, FormProps, FormItemProps } from '../../utils/form';
import { setSearchParam } from '../../utils/setSearchParam';
import { useBoolean } from '../../hooks/useBoolean';
import { Input } from '../Input';

interface FilterInputProps {
  deps?: undefined;
  placeholder?: string;
}

export { Input };

export function createFilter<T>(itemProps?: FormItemProps<T>) {
  const components = createForm<T>(itemProps);
  const { Form, FormItem, useForm } = components;

  function FilterContent({
    children,
    layout = 'grid',
    initialValues,
    onFinish,
    ...props
  }: FormProps<T> = {}) {
    const [form] = useForm();
    const params = useRef<any>();
    params.current = initialValues;

    useEffect(() => {
      form.setFieldsValue(params.current);
    }, [form]);

    return (
      <>
        <div>
          <H5>Filter</H5>
          <Form
            {...props}
            form={form}
            layout={layout}
            onFinish={payload => {
              setSearchParam(payload);
              onFinish && onFinish(payload);
            }}
          >
            {children}
            <button hidden type="submit" />
          </Form>
          <div className="filter-footer">
            <Button onClick={() => form.resetFields()}>Reset</Button>
            <Button intent="primary" onClick={form.submit}>
              Apply
            </Button>
          </div>
        </div>
      </>
    );
  }

  function Filter(props: FormProps<T> = {}) {
    const [isOpen, open, close] = useBoolean();

    return (
      <Popover
        isOpen={isOpen}
        onClose={close}
        popoverClassName="filter-popover"
        position="top-right"
        boundary="viewport"
        modifiers={{ offset: { offset: '0, -5' } }}
        content={<FilterContent {...props} onFinish={close} />}
      >
        <Button icon="filter" onClick={open} minimal />
      </Popover>
    );
  }

  function FilterInput({
    placeholder,
    ...props
  }: FormItemProps<T> & FilterInputProps = {}) {
    return (
      <FormItem {...props}>
        <Input placeholder={placeholder} />
      </FormItem>
    );
  }

  return {
    ...components,
    Filter,
    FilterInput
  };
}
