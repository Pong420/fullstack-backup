import React, { KeyboardEvent } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import {
  Suggest,
  MultiSelect,
  IListItemsProps,
  ISuggestProps,
  IMultiSelectProps
} from '@blueprintjs/select';
import { IPopoverProps } from '@blueprintjs/core';
import {
  getProductTags,
  getProductCategories
} from '@fullstack/common/service';
import { getTagProps } from '../../utils/getTagProps';
import {
  itemPredicate,
  getItemRenderer,
  transform
} from '../../utils/bpSelectHelper';

const ProductCategorySuggest = Suggest.ofType<string>();
const ProductTagsSuggest = MultiSelect.ofType<string>();

interface ProductCategorySuggestProps {
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
    captureDismiss: true,
    usePortal: false
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

const categoryReq = () =>
  getProductCategories().then(res =>
    res.data.data.map(({ category }) => category)
  );
export function ProductCategoryInput({
  value: category,
  onChange
}: ProductCategorySuggestProps) {
  const { data = [] } = useRxAsync(categoryReq);
  const handleChange = onChange || nil;

  return (
    <ProductCategorySuggest
      {...typesProps}
      fill
      className="product-types-input"
      items={data}
      selectedItem={category}
      onItemSelect={handleChange}
      onQueryChange={handleChange}
    />
  );
}

const tagProps: Omit<
  IMultiSelectProps<string>,
  'items' | 'onItemSelect' | 'itemRenderer'
> = {
  ...defaultProps,
  placeholder: '',
  createNewItemFromQuery: transform,
  tagRenderer: transform
};
const tagsReq = () =>
  getProductTags().then(res => res.data.data.map(({ tag }) => tag));
export function ProductTagsInput({
  value: selectedTags,
  onChange
}: ProductTagsSuggestProps) {
  const { data = [] } = useRxAsync(tagsReq);
  const handleChange = onChange || nil;

  return (
    <ProductTagsSuggest
      {...tagProps}
      resetOnSelect
      className="product-tags-input"
      items={data}
      selectedItems={selectedTags}
      tagInputProps={{
        tagProps: getTagProps,
        onKeyDown: preventDefaultSubmit,
        onRemove: (_tag, index) => {
          selectedTags &&
            handleChange([
              ...selectedTags.slice(0, index),
              ...selectedTags.splice(index + 1)
            ]);
        }
      }}
      itemRenderer={getItemRenderer(selectedTags)}
      onItemSelect={(tag: string) => {
        handleChange(
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
