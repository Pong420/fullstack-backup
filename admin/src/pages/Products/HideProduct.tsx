import React, { useCallback, useRef, MouseEvent, useEffect } from 'react';
import { useRxAsync } from 'use-rx-async';
import { ButtonPopover } from '../../components/ButtonPopover';
import { updateProduct as updateProductAPI } from '../../services';
import { Schema$Product } from '../../typings';
import { useProductActions } from '../../store';
import { Subject } from 'rxjs';
import { tap, debounceTime } from 'rxjs/operators';
import { useBoolean } from '../../hooks/useBoolean';

export function HideProduct({
  id,
  hidden
}: Pick<Partial<Schema$Product>, 'id' | 'hidden'>) {
  const subject = useRef(new Subject<MouseEvent>());

  const { updateProduct } = useProductActions();

  const [isHidden, { toggle }] = useBoolean(hidden);

  const request = useCallback(async () => {
    if (id) {
      const payload = { id, hidden: isHidden };
      await updateProductAPI(payload);
      updateProduct(payload);
    }
  }, [id, isHidden, updateProduct]);

  const { run } = useRxAsync(request, { defer: true });

  useEffect(() => {
    const subscription = subject.current
      .pipe(
        tap(() => toggle()),
        debounceTime(1000)
      )
      .subscribe(run);
    return () => {
      subscription.unsubscribe();
    };
  }, [id, toggle, run, updateProduct]);

  return (
    <ButtonPopover
      minimal
      onClick={event => subject.current.next(event)}
      content={isHidden ? 'Show Product' : 'Hide Product'}
      icon={isHidden ? 'eye-open' : 'eye-off'}
    />
  );
}
