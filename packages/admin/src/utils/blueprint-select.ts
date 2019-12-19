import React from 'react';
import { MenuItem } from '@blueprintjs/core';
import {
  IListItemsProps,
  IItemRendererProps,
  ItemPredicate
} from '@blueprintjs/select';
import { escapeRegex } from '@fullstack/utils';

export const getItemRenderer = (exclude: string[] = []) => {
  return (value: string, { handleClick, modifiers }: IItemRendererProps) => {
    if (!modifiers.matchesPredicate || exclude.includes(value)) {
      return null;
    }
    return React.createElement(MenuItem, {
      key: value,
      text: value,
      active: modifiers.active,
      disabled: modifiers.disabled,
      onClick: handleClick
    });
  };
};

export const itemPredicate: ItemPredicate<string> = (
  query,
  value,
  _index,
  exactMatch
) => exactMatch || new RegExp(escapeRegex(query), 'gi').test(value);

export const listItemsProps: Omit<
  IListItemsProps<string>,
  'items' | 'itemRenderer' | 'onItemSelect'
> = {};

export const transform = (s: string) => s;
