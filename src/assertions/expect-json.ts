import { expect, type APIResponse } from '@playwright/test';
import type { z } from 'zod';

export async function expectJson<S extends z.ZodType>(
  response: APIResponse,
  status: number,
  schema: S,
): Promise<z.output<S>> {
  expect(response.status(), 'HTTP status').toBe(status);
  expect(response.headers()['content-type'], 'JSON content type').toContain('application/json');
  const body: unknown = await response.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    // Report contract failures without dumping arbitrary response bodies.
    const issues = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.code}`);
    throw new Error(`Response contract failed: ${issues.join('; ')}`);
  }
  return parsed.data;
}
