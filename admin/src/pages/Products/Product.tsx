import React from 'react';
import { useSelector } from 'react-redux';
import { Divider, Tag } from '@blueprintjs/core';
import { CloudinaryImage } from '../../components/CloudinaryImage';
import { Skeleton } from '../../components/Skeleton';
import { EditProduct } from './EditProduct';
import { productSelector } from '../../store';
import { getTagProps } from '../../utils/getTagProps';

interface Props {
  id: string | null;
}

export const Product = ({ id }: Props) => {
  const product = useSelector(productSelector(id || ''));
  const { name, price, type, amount, tags = [], images = [] } = product;

  return (
    <div className="product">
      <CloudinaryImage url={images[0]} width={400} />
      <Divider />
      <div className="caption">
        <div className="row">
          <Skeleton className="product-name">{name}</Skeleton>
          <Skeleton className="product-price">{price && `$${price}`}</Skeleton>
        </div>
        <div className="row">
          <Skeleton className="product-type">{type}</Skeleton>
          <Skeleton className="product-amount">
            {amount && `Amount: ${amount}`}
          </Skeleton>
        </div>
        <div className="row">
          <div className="tags">
            {tags.map((tag, index) => (
              <Tag
                {...getTagProps(tag, index)}
                interactive
                key={index}
                icon="tag"
              >
                {tag}
              </Tag>
            ))}
          </div>
          <div>
            <EditProduct {...product} />
          </div>
        </div>
      </div>
    </div>
  );
};
