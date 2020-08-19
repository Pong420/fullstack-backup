import React, { useEffect } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { getProducts } from '@/service';
import { HomeSection } from './HomeSection';
import { HomeProductsSlide } from './HomeProductsSlide';

export function HomeRecommend() {
  const { data, run } = useRxAsync(getProducts, { defer: true });
  const products = data?.data.data.data || [];

  useEffect(() => run({ category: 'jewelry' }), [run]);

  return (
    <HomeSection label="Recommend">
      <HomeProductsSlide products={products} />
    </HomeSection>
  );
}
