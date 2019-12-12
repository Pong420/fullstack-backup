import React from 'react';
import { Classes } from '@blueprintjs/core';
import { ButtonPopover } from '../../components/ButtonPopover';
import { ProductDialog } from './ProductDialog';
import { useBoolean } from '../../hooks/useBoolean';

const title = 'Create Product';

export function CreateProduct() {
  const [isOpen, setIsOpen] = useBoolean(true);
  return (
    <>
      <ButtonPopover
        minimal
        icon="add"
        content={title}
        onClick={setIsOpen.on}
      />
      <ProductDialog
        icon="box"
        className={Classes.OVERLAY_SCROLL_CONTAINER}
        title={title}
        isOpen={isOpen}
        onClose={setIsOpen.off}
        onSubmit={console.log}
      />
    </>
  );
}
