import React, { useCallback, KeyboardEvent } from 'react';
import { useSelector } from 'react-redux';
import { useRxAsync } from 'use-rx-async';
import {
  Suggest,
  MultiSelect,
  IListItemsProps,
  ISuggestProps,
  IMultiSelectProps
} from '@blueprintjs/select';
import { IPopoverProps } from '@blueprintjs/core';
import {
  productSuggestSelector,
  useUpdateProductSuggestion
} from '../../store';
import { getSuggestion } from '../../service';
import { getTagProps } from '../../utils/getTagProps';
import {
  itemPredicate,
  getItemRenderer,
  transform
} from '../../utils/blueprint-select';

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

const defaultProps: Omit<
  IListItemsProps<string>,
  'items' | 'onItemSelect' | 'itemRenderer'
> & { popoverProps: IPopoverProps } = {
  resetOnQuery: true,
  itemPredicate,
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
  inputValueRenderer: transform,
  itemRenderer: getItemRenderer()
};

const tagProps: Omit<
  IMultiSelectProps<string>,
  'items' | 'onItemSelect' | 'itemRenderer'
> = {
  ...defaultProps,
  placeholder: '',
  createNewItemFromQuery: transform,
  tagRenderer: transform
};

function useSuggestion(type: 'types' | 'tags') {
  const { values, loaded } = useSelector(productSuggestSelector(type));
  const { updateSuggestion } = useUpdateProductSuggestion();

  const getTypes = useCallback(
    () => getSuggestion(type).then(res => ({ type, values: res.data.data })),
    [type]
  );

  useRxAsync(getTypes, { defer: loaded, onSuccess: updateSuggestion });

  return { values, loaded };
}

export function ProductTypesInput({
  value: type,
  onChange = nil
}: ProductTypesSuggestProps) {
  const { values, loaded } = useSuggestion('types');

  return (
    <ProductTypesSuggest
      {...typesProps}
      className="product-types-input"
      items={values}
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
  const { values, loaded } = useSuggestion('tags');

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
