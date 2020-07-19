/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ReactElement, ReactNode } from 'react';
import RcForm, { Field as RcField, useForm as RcUseForm } from 'rc-field-form';
import { FormProps as RcFormProps } from 'rc-field-form/es/Form';
import { FieldProps as RcFieldProps } from 'rc-field-form/es/Field';
import { FieldData, FieldError, Store } from 'rc-field-form/lib/interface';
import { View, ViewStyle } from 'react-native';
import { Validator, compose as composeValidator } from './validators';
import { NamePath, Paths, PathType, DeepPartial } from './typings';
import { Text, TextProps } from '../../components/Text';

export type FormInstance<
  S extends {} = Store,
  V = S,
  K extends keyof S = keyof S
> = {
  getFieldValue(name: K): S[K];
  getFieldValue<T extends Paths<S>>(name: T): PathType<S, T>;
  getFieldsValue: (nameList?: NamePath<S>[]) => S;
  getFieldError: (name: NamePath<S>) => string[];
  getFieldsError: (nameList?: NamePath<S>[]) => FieldError[];
  isFieldsTouched(
    nameList?: NamePath<S>[],
    allFieldsTouched?: boolean
  ): boolean;
  isFieldsTouched(allFieldsTouched?: boolean): boolean;
  isFieldTouched: (name: NamePath<S>) => boolean;
  isFieldValidating: (name: NamePath<S>) => boolean;
  isFieldsValidating: (nameList: NamePath<S>[]) => boolean;
  resetFields: (fields?: NamePath<S>[]) => void;
  setFields: (fields: FieldData[]) => void;
  setFieldsValue: (value: DeepPartial<S>) => void;
  validateFields: (nameList?: NamePath<K>[]) => Promise<V>;
  submit: () => void;
};

export interface FormProps<S extends {} = Store, V = S>
  extends Omit<RcFormProps, 'form' | 'onFinish' | 'onValuesChange'> {
  form?: FormInstance<S, V>;
  initialValues?: DeepPartial<V>;
  onFinish?: (values: V) => void;
  onValuesChange?: (changes: DeepPartial<S>, values: S) => void;
  transoformInitialValues?: (payload: DeepPartial<V>) => DeepPartial<S>;
  beforeSubmit?: (payload: S) => V;
}

type OmititedRcFieldProps = Omit<
  RcFieldProps,
  'name' | 'dependencies' | 'children' | 'rules'
>;

interface BasicFormItemProps<S extends {} = Store>
  extends OmititedRcFieldProps {
  name?: NamePath<S>;
  children?: ReactElement | ((value: S) => ReactElement);
  validators?:
    | Array<Validator | null>
    | ((value: S) => Array<Validator | null>);
  label?: ReactNode;
  noStyle?: boolean;
  style?: ViewStyle;
}

type Deps<S> = Array<NamePath<S>>;
type FormItemPropsDeps<S extends {} = Store> =
  | {
      deps?: Deps<S>;
      children?: ReactElement;
      validators?: Array<Validator | null>;
    }
  | {
      deps: Deps<S>;
      validators: (value: S) => Array<Validator | null>;
    }
  | {
      deps: Deps<S>;
      children: (value: S) => ReactElement;
    };

export type FormItemProps<S extends {} = Store> = BasicFormItemProps<S> &
  FormItemPropsDeps<S>;

type Rule = NonNullable<RcFieldProps['rules']>[number];

interface FormItemStyles {
  label?: TextProps['style'];
  help?: TextProps['style'];
}

const getValues = (obj: any, paths: (string | number)[]) =>
  paths.reduce<any>((result, key) => result[key] && result[key], obj);

export function createShouldUpdate(
  names: Array<string | number | (string | number)[]> = []
): RcFieldProps['shouldUpdate'] {
  return (prev, curr) => {
    for (const name of names) {
      const paths = Array.isArray(name) ? name : [name];
      if (getValues(prev, paths) !== getValues(curr, paths)) {
        return true;
      }
    }
    return false;
  };
}

const RED = '#DB3737';

export function createForm<S extends {} = Store, V = S>({
  itemStyles = {},
  ...defaultProps
}: Partial<FormItemProps<S>> & { itemStyles?: FormItemStyles } = {}) {
  const FormItem = (props_: FormItemProps<S>) => {
    const {
      name,
      children,
      validators = [],
      deps = [],
      noStyle,
      label,
      style,
      ...props
    } = {
      ...defaultProps,
      ...props_
    } as FormItemProps<S> & {
      deps?: Array<string | number | (string | number)[]>;
      name: string | number;
    };

    const rules: Rule[] =
      typeof validators === 'function'
        ? [
            ({ getFieldsValue }) => ({
              validator: composeValidator(
                validators(getFieldsValue(deps) as any)
              )
            })
          ]
        : [{ validator: composeValidator(validators) }];

    return React.createElement(
      RcField,
      {
        name,
        rules,
        ...(deps.length
          ? { dependencies: deps, shouldUpdate: createShouldUpdate(deps) }
          : {}),
        ...props
      },
      (control: any, { errors }: FieldData, form: FormInstance<S, V>) => {
        const { getFieldsValue } = form;

        const error = errors && errors[0];

        const childNode =
          typeof children === 'function'
            ? children(getFieldsValue(deps))
            : name
            ? React.cloneElement(children as React.ReactElement, {
                ...control,
                hasError: !!error
              })
            : children;

        if (noStyle) {
          return childNode;
        }

        return React.createElement(
          View,
          { style: { marginBottom: 10, ...style } },
          React.createElement(
            Text,
            {
              style: {
                marginBottom: 2,
                marginLeft: 2,
                ...itemStyles.label
              }
            },
            label
          ),
          childNode,
          React.createElement(
            Text,
            {
              style: {
                color: RED,
                fontSize: 14,
                minHeight: 20,
                lineHeight: 20,
                marginLeft: 2,
                ...itemStyles.help
              }
            },
            error
          )
        );
      }
    );
  };

  const Form = React.forwardRef<FormInstance<S, V>, FormProps<S, V>>(
    (
      {
        children,
        onFinish,
        beforeSubmit,
        initialValues,
        transoformInitialValues,
        ...props
      },
      ref
    ) =>
      React.createElement(
        RcForm,
        {
          ...props,
          ref,
          initialValues:
            initialValues && transoformInitialValues
              ? transoformInitialValues(initialValues)
              : initialValues,
          onFinish:
            onFinish &&
            ((store: any) => {
              onFinish(beforeSubmit ? beforeSubmit(store) : store);
            }),
          component: View
        } as any,
        children
      )
  );

  const useForm: () => [FormInstance<S, V>] = RcUseForm as any;

  return {
    Form,
    FormItem,
    FormList: RcForm.List,
    FormProvider: RcForm.FormProvider,
    useForm
  };
}
