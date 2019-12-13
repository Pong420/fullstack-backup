import React from 'react';
import { useSelector } from 'react-redux';
import { Divider, Tag, Intent } from '@blueprintjs/core';
import { Image } from '../../components/Image';
import { Skeleton } from '../../components/Skeleton';
import { productSelector } from '../../store';

interface Props {
  id: string | null;
}

const INTENTS = [
  Intent.NONE,
  Intent.PRIMARY,
  Intent.SUCCESS,
  Intent.DANGER,
  Intent.WARNING
];

export const Product = ({ id }: Props) => {
  const { name, price, type, amount, tags = [], images = [] } = useSelector(
    productSelector(id || '')
  );
  return (
    <div className="product">
      <Image url={(images[0] || {}).small} />
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
                minimal
                interactive
                key={index}
                icon="tag"
                intent={INTENTS[index % INTENTS.length]}
              >
                {tag}
              </Tag>
            ))}
          </div>
          {/* <div>
            <ProductControls id={id} />
          </div> */}
        </div>
      </div>
    </div>
  );
};
