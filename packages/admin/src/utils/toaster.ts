import { createElement, Fragment, ReactNode } from 'react';
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

const toaseter = BpToaster.create(props, document.body);

function renderMessage(titile = '', message: ReactNode = '') {
  return createElement(
    Fragment,
    null,
    createElement('div', null, titile),
    createElement('div', null, message)
  );
}

export const Toaster = {
  success(options: IToastOptions) {
    toaseter.show({
      ...defaultOptions,
      ...options,
      icon: 'tick-circle',
      intent: Intent.SUCCESS,
      message: renderMessage('Success', options.message)
    });
  },
  failure(options: IToastOptions) {
    toaseter.show({
      ...defaultOptions,
      ...options,
      icon: 'error',
      intent: Intent.DANGER,
      message: renderMessage('Error', options.message)
    });
  },
  apiError<T extends APIError>(error: T, prefix?: string) {
    toaseter.show({
      ...defaultOptions,
      className: 'api-error-toaster',
      icon: 'error',
      intent: Intent.DANGER,
      message: renderMessage(
        prefix || (error.response && error.response.data.error) || 'Error',
        getErrorMessage(error)
      )
    });
  }
};
