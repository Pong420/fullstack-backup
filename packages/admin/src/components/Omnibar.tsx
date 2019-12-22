import React, { useCallback } from 'react';
import { Classes } from '@blueprintjs/core';
import { Omnibar as Bp3Omnibar, IOmnibarProps } from '@blueprintjs/select';
import { useBoolean } from '@fullstack/common/hooks/useBoolean';
import { useSearchParam } from '@fullstack/common/hooks/useSearchParam';
import { ButtonPopover } from './ButtonPopover';
import { useMouseTrap } from '../hooks/useMouseTrap';
import {
  transform,
  itemPredicate,
  getItemRenderer
} from '../utils/blueprint-select';

const OmnibarComponent = Bp3Omnibar.ofType<string>();

export interface OmnibarProps extends Partial<IOmnibarProps<string>> {
  suffix?: string;
}

const defaultProps: Omit<
  IOmnibarProps<string>,
  'items' | 'isOpen' | 'onItemSelect'
> = {
  resetOnQuery: true,
  itemPredicate,
  itemRenderer: getItemRenderer(),
  createNewItemFromQuery: transform
};

const _items: string[] = [];

export const Omnibar = React.memo<OmnibarProps>(
  ({ items = _items, suffix = '', ...props }) => {
    const [isOpen, on, off] = useBoolean();
    const { setSearchParam } = useSearchParam();

    const openOmnibar = useCallback(() => {
      !document.body.classList.contains(Classes.OVERLAY_OPEN) && on();
    }, [on]);

    const submit = useCallback(
      (search?: string) => {
        if (isOpen) {
          // check `isOpen` prevent double key down on `Enter`
          setSearchParam({ search });
          off();
        }
      },
      [isOpen, off, setSearchParam]
    );

    useMouseTrap('shift+s', openOmnibar);

    return (
      <>
        <ButtonPopover
          minimal
          icon="search"
          content={`Search${' ' + suffix}`}
          onClick={openOmnibar}
        />
        <OmnibarComponent
          {...defaultProps}
          {...props}
          className="omnibar"
          items={items}
          isOpen={isOpen}
          onClose={off}
          onItemSelect={submit}
          inputProps={{ placeholder: `Search${' ' + suffix} ...` }}
        />
      </>
    );
  }
);
