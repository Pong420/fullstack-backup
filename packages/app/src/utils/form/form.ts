import React, { ReactElement, isValidElement } from 'react';
import { View, ViewStyle } from 'react-native';
import RcForm, { Field as RcField, useForm as RcUseForm } from 'rc-field-form';
import { FormProps as RcFormProps } from 'rc-field-form/es/Form';
import { FieldProps as RcFieldProps } from 'rc-field-form/es/Field';
import {
  FieldData,
  FieldError,
  ValidateFields,
  Store
} from 'rc-field-form/lib/interface';
import { Validator, compose } from '@fullstack/common/utils/form/validators';
import { Text, TextProps } from '../../components/Text';

type ValueOf<T> = T[keyof T];

type NamePath<K extends PropertyKey> = K | K[];

export type FormInstance<T extends {} = {}, K extends keyof T = keyof T> = {
  getFieldValue: (name: NamePath<K>) => T[K];
  getFieldsValue: (nameList?: NamePath<K>[]) => T;
  getFieldError: (name: NamePath<K>) => string[];
  getFieldsError: (nameList?: NamePath<K>[]) => FieldError[];
  isFieldsTouched(
    nameList?: NamePath<K>[],
    allFieldsTouched?: boolean
  ): boolean;
  isFieldsTouched(allFieldsTouched?: boolean): boolean;
  isFieldTouched: (name: NamePath<K>) => boolean;
  isFieldValidating: (name: NamePath<K>) => boolean;
  isFieldsValidating: (nameList: NamePath<K>[]) => boolean;
  resetFields: (fields?: NamePath<K>[]) => void;
  setFields: (fields: FieldData[]) => void;
  setFieldsValue: (value: T) => void;
  validateFields: ValidateFields;
  submit: () => void;
};

export interface FormProps<T extends {} = Store>
  extends Omit<RcFormProps, 'form' | 'onFinish'> {
  form?: FormInstance<T>;
  initialValues?: Partial<T>;
  onFinish?: (values: T) => void;
  items?: Array<FormItemProps<T>>;
}

type OmititedRcFieldProps = Omit<
  RcFieldProps,
  'name' | 'dependencies' | 'children'
>;

interface BasicFormItemProps<T extends {}, K extends keyof T = keyof T>
  extends OmititedRcFieldProps {
  name?: K | K[];
  children?: ReactElement | ((value: T) => ReactElement);
  validators?:
    | Array<Validator | null>
    | ((value: T) => Array<Validator | null>);
  validateTrigger?: string | string[];
  onReset?(): void;
  label?: string;
  noStyle?: boolean;
  style?: ViewStyle;
  key?: React.Key;
}

type FormItemPropsDeps<T extends {}, K extends keyof T = keyof T> = {
  basic: {
    deps?: K[];
    children?: ReactElement;
    validators?: Array<Validator | null>;
  };
  case1: {
    deps: K[];
    validators: (value: T) => Array<Validator | null>;
  };
  case2: {
    deps: K[];
    children: (value: T) => ReactElement;
  };
};

export type FormItemProps<
  T extends {},
  K extends keyof T = keyof T
> = BasicFormItemProps<T, K> & (ValueOf<FormItemPropsDeps<T, K>>);

type Rule = NonNullable<RcFieldProps['rules']>[number];

interface FormItemStyles {
  label?: TextProps['style'];
  help?: TextProps['style'];
}

export function createShouldUpdate<FieldName extends string | number>(
  names: FieldName[]
): RcFieldProps['shouldUpdate'] {
  return (prev, curr) => {
    for (const name of names) {
      if (prev[name] !== curr[name]) {
        return true;
      }
    }
    return false;
  };
}

const RED = '#DB3737';

export function createForm<T extends {}>({
  itemStyles = {},
  ...defaultProps
}: Partial<FormItemProps<T>> & { itemStyles?: FormItemStyles } = {}) {
  const FormItem = React.memo<FormItemProps<T>>(props_ => {
    const {
      children,
      rules = [],
      validators = [],
      validateTrigger,
      noStyle,
      label,
      style,
      deps = [],
      ...props
    } = {
      ...defaultProps,
      ...props_
    } as FormItemProps<T> & {
      deps?: Array<string | number>;
      name: string | number;
    };

    const _rules: Rule[] =
      typeof validators === 'function'
        ? [
            ({ getFieldsValue }) => ({
              validator: compose(validators(getFieldsValue(deps) as any))
            })
          ]
        : validators.map<Rule>(validator => ({
            validator: validator ? validator : undefined
          }));

    return React.createElement(
      RcField,
      {
        dependencies: [props.name, ...deps],
        shouldUpdate: createShouldUpdate([props.name, ...deps])
      },
      (_: any, _fieldData: FieldData, form: FormInstance<T>) => {
        const { getFieldError, getFieldsValue } = form;
        const errors = getFieldError(props.name);

        const field = React.createElement(
          RcField,
          {
            rules: [...rules, ..._rules],
            validateTrigger,
            ...props
          },
          isValidElement(children)
            ? React.cloneElement(
                typeof children !== 'function'
                  ? children
                  : children(getFieldsValue(deps)),
                { hasError: !!errors[0] }
              )
            : children
        );

        if (noStyle) {
          return field;
        }

        return React.createElement(
          View,
          { style },
          React.createElement(
            Text,
            {
              style: {
                marginBottom: 5,
                marginLeft: 2,
                ...itemStyles.label
              }
            },
            label
          ),
          field,
          React.createElement(
            Text,
            {
              style: {
                color: RED,
                fontSize: 14,
                minHeight: 20,
                lineHeight: 20,
                ...itemStyles.help
              }
            },
            errors[0]
          )
        );
      }
    );
  });

  const Form = React.memo(
    React.forwardRef<FormInstance<T>, FormProps<T>>(
      ({ children, onFinish, items = [], ...props }, ref: any) =>
        React.createElement(
          RcForm,
          {
            ...props,
            ref,
            onFinish,
            component: View
          } as any,
          [
            ...items.map(({ key, style, name, ...props }, index) =>
              React.createElement(FormItem, {
                ...props,
                key:
                  key ||
                  (Array.isArray(name) ? name.join('') : `${name}`) ||
                  Math.random(),
                name,
                style: { marginTop: index && 10, ...style }
              })
            ),
            children
          ]
        )
    )
  );

  const useForm: (
    form?: FormInstance<T>
  ) => [FormInstance<T>] = RcUseForm as any;

  return {
    Form,
    FormItem,
    useForm
  };
}
