import { test, expect } from '../../src/fixtures/api.fixture.js';
import { expectJson } from '../../src/assertions/expect-json.js';
import { apiErrorSchema } from '../../src/api/products.schemas.js';

test('GET for a missing product returns a meaningful 404', async ({ products }) => {
  const error = await expectJson(await products.get(0), 404, apiErrorSchema);
  expect(error.message).toContain('0');
});

test('updating a missing product returns 404', async ({ products }) => {
  const error = await expectJson(
    await products.update(0, { title: 'Synthetic missing product' }),
    404,
    apiErrorSchema,
  );
  expect(error.message).toContain('0');
});

test('deleting a missing product returns 404', async ({ products }) => {
  const error = await expectJson(await products.delete(0), 404, apiErrorSchema);
  expect(error.message).toContain('0');
});
