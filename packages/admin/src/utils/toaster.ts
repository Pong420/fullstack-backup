import { createElement, Fragment, ReactNode } from 'react';
import { Subject, timer } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import {
  Position,
  Intent,
  IToastProps,
  IToasterProps,
  IToastOptions,
  Toaster as BpToaster
} from '@blueprintjs/core';
import { ApiError } from '@fullstack/typings';
import { getErrorMessage } from '../service';

const props: IToasterProps = {
  position: Position.TOP_RIGHT
};

const defaultOptions: Omit<IToastOptions, 'message'> = {
  timeout: 4000
};

const toaseter = BpToaster.create(props, document.body);

const toaseterSubject = new Subject<IToastProps>();
toaseterSubject
  .pipe(
    concatMap(props => {
      toaseter.show(props);
      return timer(500);
    })
  )
  .subscribe();

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
    toaseterSubject.next({
      ...defaultOptions,
      ...options,
      icon: 'tick-circle',
      intent: Intent.SUCCESS,
      message: renderMessage('Success', options.message)
    });
  },
  failure(options: IToastOptions) {
    toaseterSubject.next({
      ...defaultOptions,
      ...options,
      icon: 'error',
      intent: Intent.DANGER,
      message: renderMessage('Error', options.message)
    });
  },
  apiError(prefix: string = '', error: ApiError) {
    toaseterSubject.next({
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
