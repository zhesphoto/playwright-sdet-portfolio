import { randomUUID } from 'node:crypto';

export type ProductInput = {
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
};

export function buildProduct(overrides: Partial<ProductInput> = {}): ProductInput {
  return {
    title: `Synthetic notebook ${randomUUID()}`,
    description: 'Synthetic product for a public automation demonstration.',
    category: 'stationery',
    price: 12.5,
    stock: 8,
    ...overrides,
  };
}
