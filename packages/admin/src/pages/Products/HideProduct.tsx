import React, { useRef, useEffect } from 'react';
import { Subject, from } from 'rxjs';
import { tap, debounceTime, filter, map, mergeMap } from 'rxjs/operators';
import { ButtonPopover } from '../../components/ButtonPopover';
import { updateProduct as updateProductAPI } from '../../service';
import { Schema$Product, ProductStatus } from '../../typings';
import { useProductActions } from '../../store';
import { useBoolean } from '@fullstack/common/hooks/useBoolean';

export function HideProduct({
  id = '',
  status
}: Pick<Partial<Schema$Product>, 'id' | 'status'>) {
  const subject = useRef(new Subject<boolean>());

  const { updateProduct } = useProductActions();

  const [isHidden, , , toggle] = useBoolean(status === ProductStatus.HIDDEN);

  useEffect(() => {
    const subscription = subject.current
      .pipe(
        tap(() => toggle()),
        debounceTime(1000),
        map(isHidden =>
          isHidden ? ProductStatus.HIDDEN : ProductStatus.VISIBLE
        ),
        filter(status_ => status_ !== status),
        mergeMap(status =>
          from(updateProductAPI({ id, status }).then(res => res.data.data))
        )
      )
      .subscribe(updateProduct);

    return () => subscription.unsubscribe();
  }, [id, status, toggle, updateProduct]);

  return (
    <ButtonPopover
      minimal
      onClick={() => subject.current.next(!isHidden)}
      icon={isHidden ? 'eye-open' : 'eye-off'}
      content={isHidden ? 'Show Product' : 'Hide Product'}
    />
  );
}
