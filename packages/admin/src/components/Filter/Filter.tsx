import React, { useEffect, useRef, useState } from 'react';
import { fromEvent } from 'rxjs';
import { Button, Popover, H5, IPopoverProps } from '@blueprintjs/core';
import { DateRangeInput } from '@blueprintjs/datetime';
import { Timestamp } from '@fullstack/typings';
import { ButtonPopover } from '../../components/ButtonPopover';
import { createForm, FormProps, FormItemProps } from '../../utils/form';
import { setSearchParam, hasQuery } from '../../utils/setSearchParam';
import { useBoolean } from '../../hooks/useBoolean';
import { Input } from '../Input';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';

interface FilterInputProps {
  deps?: undefined;
  placeholder?: string;
}

interface FilterDateRangeProps {
  deps?: undefined;
}

export { Input };

const dateKeys: (keyof Timestamp)[] = ['createdAt', 'updatedAt'];

export function createFilter<T>(itemProps?: FormItemProps<T>) {
  const components = createForm<T, T>(itemProps);
  const { Form, FormItem, useForm } = components;

  function FilterContent({
    children,
    layout = 'grid',
    initialValues,
    onFinish,
    ...props
  }: FormProps<T> = {}) {
    const [form] = useForm();
    const { setFieldsValue } = form;
    const params = useRef<any>();
    params.current = initialValues;

    useEffect(() => {
      const clone = { ...params.current };
      for (const key of dateKeys) {
        const date = clone[key];
        clone[key] = Array.isArray(date)
          ? date.map(s => new Date(s))
          : undefined;
      }
      setFieldsValue(clone);
    }, [setFieldsValue]);

    return (
      <>
        <div>
          <H5>Filter</H5>
          <Form
            {...props}
            form={form}
            layout={layout}
            onFinish={payload => {
              setSearchParam(payload as Record<string, unknown>);
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
    const [modifiers, setModifiers] = useState<IPopoverProps['modifiers']>();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const localtion = useLocation();
    const filtered = hasQuery(localtion);

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
        <ButtonPopover
          icon={filtered ? 'filter-keep' : 'filter'}
          content="Filter"
          onClick={open}
          elementRef={buttonRef}
          minimal
        />
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

  function FilterDateRange(
    props: FormItemProps<T> & FilterDateRangeProps = {}
  ) {
    return (
      <FormItem {...props}>
        <DateRangeInput
          className="date-range-input"
          shortcuts={false}
          allowSingleDayRange
          formatDate={date => dayjs(date).format('YYYY-MM-DD')}
          parseDate={str => new Date(str)}
        />
      </FormItem>
    );
  }

  return {
    ...components,
    Filter,
    FilterInput,
    FilterDateRange
  };
}
