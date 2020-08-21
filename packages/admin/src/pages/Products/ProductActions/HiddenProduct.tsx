import React, { useRef, useEffect } from 'react';
import { Subject, defer } from 'rxjs';
import { tap, debounceTime, switchMap } from 'rxjs/operators';
import { updateProduct } from '@fullstack/common/service';
import { useBoolean } from '@fullstack/common/hooks';
import { OnUpdate } from './UpdateProduct';
import { ButtonPopover } from '../../../components/ButtonPopover';
import { Toaster } from '../../../utils/toaster';

interface Props extends OnUpdate {
  id?: string;
  hidden?: boolean;
}

export function HiddenProduct({ id = '', hidden, onUpdate }: Props) {
  const subject = useRef(new Subject<boolean>());

  const [isHidden, , , toggle] = useBoolean(!!hidden);

  useEffect(() => {
    const subscription = subject.current
      .pipe(
        tap(() => toggle()),
        debounceTime(400),
        switchMap(hidden =>
          defer(() => updateProduct({ id, hidden }).then(res => res.data.data))
        )
      )
      .subscribe(
        product => {
          onUpdate(product);
          Toaster.success({ message: 'Update product success' });
        },
        error => {
          Toaster.apiError('Update product failure', error);
        }
      );

    return () => subscription.unsubscribe();
  }, [id, toggle, onUpdate]);

  return (
    <ButtonPopover
      minimal
      onClick={() => subject.current.next(!isHidden)}
      icon={isHidden ? 'eye-off' : 'eye-open'}
      content={isHidden ? 'Show Product' : 'Hide Product'}
    />
  );
}
