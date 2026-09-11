import type { APIRequestContext } from '@playwright/test';
import type { ProductInput } from '../data/products.js';

export type ProductQuery = {
  limit?: number;
  skip?: number;
  sortBy?: 'price' | 'title';
  order?: 'asc' | 'desc';
};

// Return the HTTP response so tests can inspect status, headers, and body.
// No automatic retries: a failed write must remain visible to the caller.
export class ProductsClient {
  constructor(private readonly request: APIRequestContext) {}

  list(params: ProductQuery = {}) {
    return this.request.get('/products', { params, maxRetries: 0, maxRedirects: 0 });
  }

  get(id: number) {
    return this.request.get(`/products/${id}`, { maxRetries: 0, maxRedirects: 0 });
  }

  search(query: string) {
    return this.request.get('/products/search', {
      params: { q: query, limit: 10 },
      maxRetries: 0,
      maxRedirects: 0,
    });
  }

  create(product: ProductInput) {
    return this.request.post('/products/add', { data: product, maxRetries: 0, maxRedirects: 0 });
  }

  update(id: number, changes: Partial<ProductInput>) {
    return this.request.put(`/products/${id}`, { data: changes, maxRetries: 0, maxRedirects: 0 });
  }

  delete(id: number) {
    return this.request.delete(`/products/${id}`, { maxRetries: 0, maxRedirects: 0 });
  }
}
