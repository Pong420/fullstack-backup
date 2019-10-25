import { createElement, Fragment } from 'react';
import { AxiosError } from 'axios';
import {
  Position,
  Intent,
  IToasterProps,
  IToastOptions,
  Toaster as BpToaster
} from '@blueprintjs/core';

const props: IToasterProps = {
  position: Position.TOP_RIGHT
};

const options: Omit<IToastOptions, 'message'> = {
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

export const Toaster = {
  apiError<T extends AxiosError<{ message: string }>>(
    error: T,
    prefix?: string
  ) {
    apiError.show({
      ...options,
      icon: 'error',
      message: createElement(Fragment, null, [
        createElement('div', { key: 1 }, prefix),
        createElement(
          'div',
          { key: 2 },
          error.response ? error.response.data.message : error.message
        )
      ]),
      intent: Intent.DANGER
    });

    return apiError;
  }
};
