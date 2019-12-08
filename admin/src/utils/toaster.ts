import { createElement, Fragment } from 'react';
import {
  Position,
  Intent,
  IToasterProps,
  IToastOptions,
  Toaster as BpToaster
} from '@blueprintjs/core';
import { APIError } from '../typings';
import { getErrorMessage } from '../utils/getErrorMessage';

const props: IToasterProps = {
  position: Position.TOP_RIGHT
};

const defaultOptions: Omit<IToastOptions, 'message'> = {
  timeout: 4000
};

const container = document.body;

const apiError = BpToaster.create(
  {
    ...props,
    className: 'api-error-toaster'
  },
  container
);

const success = BpToaster.create(props, container);

export const Toaster = {
  success(options: IToastOptions) {
    success.show({
      ...options,
      icon: 'tick-circle',
      intent: Intent.SUCCESS,
      message: createElement(
        Fragment,
        null,
        createElement('div', null, 'Success'),
        createElement('div', null, options.message)
      )
    });
  },
  apiError<T extends APIError>(error: T, prefix?: string) {
    apiError.show({
      ...defaultOptions,
      icon: 'error',
      intent: Intent.DANGER,
      message: createElement(
        Fragment,
        null,
        createElement(
          'div',
          null,
          prefix || (error.response && error.response.data.error) || 'Error'
        ),
        createElement('div', null, getErrorMessage(error))
      )
    });

    return apiError;
  }
};
