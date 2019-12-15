import React from 'react';
import { useSelector } from 'react-redux';
import { Divider, Tag } from '@blueprintjs/core';
import { CloudinaryImage } from '../../components/CloudinaryImage';
import { Skeleton } from '../../components/Skeleton';
import { EditProduct } from './EditProduct';
import { DeleteProduct } from './DeleteProduct';
import { HideProduct } from './HideProduct';
import { productSelector } from '../../store';
import { getTagProps } from '../../utils/getTagProps';
import { useSearchParam } from '../../hooks/useSearchParam';

interface Props {
  id: string | null;
}

export const Product = React.memo<Props>(({ id }) => {
  const product = useSelector(productSelector(id || ''));
  const { name, price, type, amount, tags = [], images = [] } = product;
  const [, setSearchParam] = useSearchParam();

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
          <Skeleton className="product-type">
            {type && (
              <span
                className="searchable"
                onClick={() =>
                  setSearchParam({ pageNo: undefined, search: `type:${type}` })
                }
              >
                {type}
              </span>
            )}
          </Skeleton>
          <Skeleton className="product-amount">
            {amount && `Amount: ${amount}`}
          </Skeleton>
        </div>
        <div>
          <div className="product-controls">
            <EditProduct {...product} />
            <DeleteProduct id={id || undefined} name={name} />
            <HideProduct id={id || undefined} hidden={product.hidden} />
          </div>
          <div className="tags">
            {tags.map((tag, index) => (
              <Tag
                {...getTagProps(tag, index)}
                interactive
                key={index}
                onClick={() =>
                  setSearchParam({ pageNo: undefined, search: `tag:${tag}` })
                }
              >
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
