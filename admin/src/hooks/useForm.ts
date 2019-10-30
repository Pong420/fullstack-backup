import { useState, useMemo, ChangeEvent, useCallback } from 'react';
import { Validator, compose } from '../utils/validators';

type TargetElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

interface FormGroup {
  [k: string]: [any, (Validator | Validator[])?];
}

export function FormBuilder<Group extends FormGroup>(group: Group) {
  const fields: Array<keyof Group> = [];
  const initialValues = {} as { [Key in keyof Group]: Group[Key][0] };
  const validators = {} as { [Key in keyof Group]?: Validator };

  for (const key in group) {
    const [value, validator] = group[key];
    fields.push(key);
    initialValues[key] = value;
    validators[key] =
      validator &&
      compose(...(Array.isArray(validator) ? validator : [validator]));
  }

  return { fields, initialValues, validators };
}

interface Props<
  F extends string,
  V extends { [Key in F]: any },
  VT extends { [Key in F]?: Validator }
> {
  fields: F[];
  initialValues: V;
  validators: VT;
}

export function useForm<
  F extends string,
  V extends { [Key in F]: any },
  VT extends { [Key in F]?: Validator }
>({ fields, initialValues, validators }: Props<F, V, VT>) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<{ [Key in F]?: string }>({});

  const validate_ = useCallback(
    (field: F, value: V[F]) => {
      const validator = validators[field];
      if (validator) {
        const error = validator(value);
        setErrors(curr => ({ ...curr, [field]: error }));
        return !!error;
      }
      return false;
    },
    [validators]
  );

  const isValid = useCallback(
    (field?: F | F[]) => {
      let hasError = false;
      function validate(fields: F[]) {
        for (const field of fields) {
          const newError = validate_(field, values[field]);
          hasError = hasError || newError;
        }
      }

      validate(field ? (Array.isArray(field) ? field : [field]) : fields);

      return !hasError;
    },
    [values, fields, validate_]
  );

  const handler = useMemo(() => {
    const onChange = (field: F) => (value: V[F]) => {
      setValues(curr => ({ ...curr, [field]: value }));
      validate_(field, value);
    };

    const getValueFromEvent = <T extends TargetElement>(
      event: ChangeEvent<T>
    ) => {
      if (event.target instanceof HTMLInputElement) {
        switch (event.target.type) {
          case 'checkbox':
          case 'radio':
            return event.target.checked;
          case 'file':
            const files = event.target.files || ([] as File[]);
            return Array.from(
              { length: files.length },
              (_, index) => files[index]
            );
        }
      }
      return event.target.value;
    };

    const handleChange = <T extends TargetElement>(key: F) => (
      event: ChangeEvent<T>
    ) => {
      const value = getValueFromEvent(event);
      onChange(key)(value as V[F]);
    };

    const handler = {} as {
      [Key in F]: {
        getValueFromEvent: typeof getValueFromEvent;
        handleChange: ReturnType<typeof handleChange>;
        onChange: ReturnType<typeof onChange>;
      };
    };

    for (const field of fields) {
      handler[field] = {
        getValueFromEvent,
        onChange: onChange(field),
        handleChange: handleChange(field)
      };
    }

    return handler;
  }, [fields, validate_]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return { values, errors, handler, isValid, resetForm };
}
