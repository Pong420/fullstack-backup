export enum ProductStatus {
  VISIBLE,
  HIDDEN
}

export interface Schema$Product {
  id: string;

  name: string;

  description: string;

  price: number;

  amount: number;

  type: string;

  images: string[];

  tags: string[];

  status: ProductStatus;
}
