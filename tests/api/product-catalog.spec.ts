import { test, expect } from '../../src/fixtures/api.fixture.js';
import { expectJson } from '../../src/assertions/expect-json.js';
import { productListSchema, productSchema } from '../../src/api/products.schemas.js';

test('catalog returns a bounded page with unique product IDs @smoke', async ({ products }) => {
  const page = await expectJson(await products.list({ limit: 5, skip: 0 }), 200, productListSchema);
  expect(page.limit).toBe(5);
  expect(page.skip).toBe(0);
  expect(page.total).toBeGreaterThanOrEqual(5);
  expect(page.products).toHaveLength(5);
  expect(new Set(page.products.map((product) => product.id)).size).toBe(5);
});

test('adjacent catalog pages do not overlap', async ({ products }) => {
  const first = await expectJson(
    await products.list({ limit: 5, skip: 0 }),
    200,
    productListSchema,
  );
  const second = await expectJson(
    await products.list({ limit: 5, skip: 5 }),
    200,
    productListSchema,
  );
  expect(second.skip).toBe(5);
  expect(second.products).toHaveLength(5);
  expect(second.total).toBe(first.total);
  const firstIds = new Set(first.products.map((product) => product.id));
  expect(second.products.filter((product) => firstIds.has(product.id))).toHaveLength(0);
});

test('product details agree with the catalog @smoke', async ({ products, existingProduct }) => {
  const product = await expectJson(await products.get(existingProduct.id), 200, productSchema);
  expect(product).toEqual(existingProduct);
});

for (const order of ['asc', 'desc'] as const) {
  test(`catalog sorts prices in ${order} order`, async ({ products }) => {
    const page = await expectJson(
      await products.list({ limit: 10, sortBy: 'price', order }),
      200,
      productListSchema,
    );
    expect(page.products).toHaveLength(10);
    const prices = page.products.map((product) => product.price);
    const sorted = [...prices].sort((a, b) => (order === 'asc' ? a - b : b - a));
    expect(prices).toEqual(sorted);
  });
}

test('search finds a product by its current title', async ({ products, existingProduct }) => {
  const results = await expectJson(
    await products.search(existingProduct.title),
    200,
    productListSchema,
  );
  expect(results.products.map((product) => product.id)).toContain(existingProduct.id);
});

test('a synthetic search term returns an empty result', async ({ products }) => {
  const results = await expectJson(
    await products.search('synthetic-no-match-8bf2461d'),
    200,
    productListSchema,
  );
  expect(results.total).toBe(0);
  expect(results.products).toEqual([]);
});
