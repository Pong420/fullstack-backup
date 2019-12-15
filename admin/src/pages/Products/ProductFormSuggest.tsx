import React, { useMemo, KeyboardEvent, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Suggest,
  MultiSelect,
  IListItemsProps,
  IItemRendererProps,
  ISuggestProps,
  IMultiSelectProps
} from '@blueprintjs/select';
import { MenuItem, IPopoverProps } from '@blueprintjs/core';
import {
  productTypesSelector,
  productTagsSelector,
  useUpdateProductSuggestion
} from '../../store';
import { getSuggestion } from '../../services';
import { escapeRegex } from '../../utils/escapeRegex';
import { getTagProps } from '../../utils/getTagProps';
import useRxAsync from 'use-rx-async';

const ProductTypesSuggest = Suggest.ofType<string>();
const ProductTagsSuggest = MultiSelect.ofType<string>();

interface ProductTypesSuggestProps {
  value?: string;
  onChange?: (value: string) => void;
}

interface ProductTagsSuggestProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const nil = () => {};

const preventDefaultSubmit = (event: KeyboardEvent<any>) =>
  event.keyCode === 13 && event.preventDefault();

const getItemRenderer = (exclude: string[] = []) => {
  return (value: string, { handleClick, modifiers }: IItemRendererProps) => {
    if (!modifiers.matchesPredicate || exclude.includes(value)) {
      return null;
    }
    return (
      <MenuItem
        key={value}
        text={value}
        active={modifiers.active}
        disabled={modifiers.disabled}
        onClick={handleClick}
      />
    );
  };
};

const defaultProps: Omit<
  IListItemsProps<string>,
  'items' | 'onItemSelect' | 'itemRenderer'
> & { popoverProps: IPopoverProps } = {
  resetOnQuery: true,
  itemPredicate: (query, value, _index, exactMatch) =>
    exactMatch || new RegExp(escapeRegex(query), 'gi').test(value),
  popoverProps: {
    fill: true,
    minimal: true,
    popoverClassName: 'product-suggest-popover'
  }
};

const typesProps: Omit<ISuggestProps<string>, 'items' | 'onItemSelect'> = {
  ...defaultProps,
  closeOnSelect: true,
  inputProps: {
    placeholder: '',
    onKeyDown: preventDefaultSubmit
  },
  inputValueRenderer: v => v,
  itemRenderer: getItemRenderer()
};

const tagProps: Omit<
  IMultiSelectProps<string>,
  'items' | 'onItemSelect' | 'itemRenderer'
> = {
  ...defaultProps,
  placeholder: '',
  createNewItemFromQuery: t => t,
  tagRenderer: t => t
};

export function ProductTypesInput({
  value: type,
  onChange = nil
}: ProductTypesSuggestProps) {
  const { values, loaded } = useSelector(productTypesSelector);
  const { updateSuggestion } = useUpdateProductSuggestion();

  const items = useMemo(
    () => (!type || values.includes(type) ? values : [type, ...values]),
    [type, values]
  );

  const getTypes = useCallback(
    () =>
      getSuggestion('types').then(res =>
        updateSuggestion({ type: 'types', values: res.data.data })
      ),
    [updateSuggestion]
  );

  useRxAsync(getTypes, { defer: loaded });

  return (
    <ProductTypesSuggest
      {...typesProps}
      className="product-types-input"
      items={items}
      key={String(loaded)}
      defaultSelectedItem={type}
      onItemSelect={onChange}
      onQueryChange={onChange}
    />
  );
}

export function ProductTagsInput({
  value: selectedTags,
  onChange = nil
}: ProductTagsSuggestProps) {
  const { values, loaded } = useSelector(productTagsSelector);
  const { updateSuggestion } = useUpdateProductSuggestion();
  const getTags = useCallback(
    () =>
      getSuggestion('tags').then(res =>
        updateSuggestion({ type: 'tags', values: res.data.data })
      ),
    [updateSuggestion]
  );

  useRxAsync(getTags, { defer: loaded });

  return (
    <ProductTagsSuggest
      {...tagProps}
      className="product-tags-input"
      items={values}
      key={String(loaded)}
      selectedItems={selectedTags}
      tagInputProps={{
        tagProps: getTagProps,
        onKeyDown: preventDefaultSubmit,
        onRemove: (_tag, index) => {
          selectedTags &&
            onChange([
              ...selectedTags.slice(0, index),
              ...selectedTags.splice(index + 1)
            ]);
        }
      }}
      itemRenderer={getItemRenderer(selectedTags)}
      onItemSelect={(tag: string) => {
        onChange(
          selectedTags
            ? selectedTags.includes(tag)
              ? selectedTags
              : [...selectedTags, tag]
            : [tag]
        );
      }}
    />
  );
}
