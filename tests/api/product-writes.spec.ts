import { test, expect } from '../../src/fixtures/api.fixture.js';
import { expectJson } from '../../src/assertions/expect-json.js';
import {
  apiErrorSchema,
  deletedProductSchema,
  productSchema,
} from '../../src/api/products.schemas.js';
import { buildProduct } from '../../src/data/products.js';

test('create echoes the synthetic product without persisting it @smoke', async ({ products }) => {
  const input = buildProduct();
  const created = await expectJson(await products.create(input), 201, productSchema);
  expect(created).toMatchObject(input);

  // DummyJSON simulates writes. A successful POST is not evidence of persistence.
  const missing = await expectJson(await products.get(created.id), 404, apiErrorSchema);
  expect(missing.message).toContain(String(created.id));
});

test('update echoes changed fields and leaves the catalog unchanged', async ({
  products,
  existingProduct,
}) => {
  const changes = { title: 'Synthetic updated notebook', price: 19.75 };
  const updated = await expectJson(
    await products.update(existingProduct.id, changes),
    200,
    productSchema,
  );
  expect(updated).toMatchObject({ ...existingProduct, ...changes });

  const stored = await expectJson(await products.get(existingProduct.id), 200, productSchema);
  expect(stored).toEqual(existingProduct);
});

test('delete returns deletion metadata without removing the catalog entry', async ({
  products,
  existingProduct,
}) => {
  const deleted = await expectJson(
    await products.delete(existingProduct.id),
    200,
    deletedProductSchema,
  );
  expect(deleted).toMatchObject({ ...existingProduct, isDeleted: true });
  const stored = await expectJson(await products.get(existingProduct.id), 200, productSchema);
  expect(stored).toEqual(existingProduct);
});
