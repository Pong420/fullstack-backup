import React, { useCallback, useRef, MouseEvent, useEffect } from 'react';
import { useRxAsync } from 'use-rx-async';
import { ButtonPopover } from '../../components/ButtonPopover';
import { updateProduct as updateProductAPI } from '../../services';
import { Schema$Product, ProductStatus } from '../../typings';
import { useProductActions } from '../../store';
import { Subject } from 'rxjs';
import { tap, debounceTime } from 'rxjs/operators';
import { useBoolean } from '../../hooks/useBoolean';

export function HideProduct({
  id,
  status
}: Pick<Partial<Schema$Product>, 'id' | 'status'>) {
  const subject = useRef(new Subject<MouseEvent>());

  const { updateProduct } = useProductActions();

  const [isHidden, { toggle }] = useBoolean(status === ProductStatus.HIDDEN);

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
