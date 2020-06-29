import React, { useEffect, useRef, useState } from 'react';
import { fromEvent } from 'rxjs';
import { Button, Popover, H5, IPopoverProps } from '@blueprintjs/core';
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
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [modifiers, setModifiers] = useState<IPopoverProps['modifiers']>();

    useEffect(() => {
      function handler() {
        const button = buttonRef.current;
        const layout = document.querySelector<HTMLElement>(
          '.layout .layout-content'
        );
        if (button && layout) {
          const rect = button.getBoundingClientRect();
          let left =
            rect.left -
            layout.getBoundingClientRect().left -
            layout.offsetWidth / 2 +
            15.5;
          setModifiers({ offset: { offset: `${left * -1}, -5` } });
        }
      }

      if (isOpen) {
        handler();
        const subscription = fromEvent(window, 'resize').subscribe(close);
        return () => subscription.unsubscribe();
      }
    }, [isOpen, close]);

    return (
      <Popover
        position="bottom"
        boundary="viewport"
        popoverClassName="filter-popover"
        isOpen={isOpen}
        onClose={close}
        modifiers={modifiers}
        content={<FilterContent {...props} onFinish={close} />}
      >
        <Button icon="filter" onClick={open} minimal elementRef={buttonRef} />
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
