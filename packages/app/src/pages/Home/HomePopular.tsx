import React, { useEffect } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { getProducts } from '@/service';
import { HomeSection } from './HomeSection';
import { HomeProductsSlide } from './HomeProductsSlide';

export function HomePopular() {
  const [{ data }, { fetch }] = useRxAsync(getProducts, { defer: true });
  const products = data?.data.data.data || [];

  useEffect(() => fetch({ category: 'clothes' }), [fetch]);

  return (
    <HomeSection label="Popular">
      <HomeProductsSlide products={products} />
    </HomeSection>
  );
}
