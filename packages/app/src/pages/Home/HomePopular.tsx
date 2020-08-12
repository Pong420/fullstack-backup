import React, { useEffect } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { getProducts } from '@fullstack/common/service';
import { HomeSection } from './HomeSection';
import { HomeProductsSlide } from './HomeProductsSlide';

export function HomePopular() {
  const { data, run } = useRxAsync(getProducts, { defer: true });
  const products = data?.data.data.data || [];

  useEffect(() => run({ category: 'clothes' }), [run]);

  return (
    <HomeSection label="Popular">
      <HomeProductsSlide products={products} />
    </HomeSection>
  );
}
