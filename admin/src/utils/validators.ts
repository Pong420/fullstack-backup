export type Validator = (value: any) => string;
export type HigherOrderValidator = (errorMsg: string) => Validator;

export const compose = (...validators: Array<Validator | null>): Validator => {
  return value => {
    for (const validator of validators) {
      if (validator) {
        const errorMsg = validator(value);
        if (errorMsg) return errorMsg;
      }
    }
    return '';
  };
};

export const required: HigherOrderValidator = errorMsg => value => {
  const val = typeof value === 'string' ? value.trim() : value;
  const valid = !!(Array.isArray(val) ? val.length : val === 0 || val);
  return valid ? '' : errorMsg;
};

export const isNumber: HigherOrderValidator = errorMsg => value =>
  isNaN(Number(value)) && value !== null && value !== '' ? errorMsg : '';
