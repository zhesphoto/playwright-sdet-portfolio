import { test as base } from '@playwright/test';
import { ProductsClient } from '../api/products.client.js';
import { productListSchema, type Product } from '../api/products.schemas.js';
import { expectJson } from '../assertions/expect-json.js';
import { targets } from '../config/targets.js';
import { networkProxy } from '../config/network.js';

type Fixtures = { products: ProductsClient; existingProduct: Product };

export const test = base.extend<Fixtures>({
  products: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      ...(networkProxy ? { proxy: networkProxy } : {}),
      baseURL: targets.api,
      extraHTTPHeaders: { Accept: 'application/json' },
      timeout: 15_000,
    });
    try {
      await use(new ProductsClient(context));
    } finally {
      await context.dispose();
    }
  },
  existingProduct: async ({ products }, use) => {
    const catalog = await expectJson(await products.list({ limit: 1 }), 200, productListSchema);
    const product = catalog.products[0];
    if (!product) throw new Error('Public demo catalog has no products to test');
    await use(product);
  },
});

export { expect } from '@playwright/test';
