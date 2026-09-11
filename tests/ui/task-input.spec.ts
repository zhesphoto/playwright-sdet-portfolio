import { test, expect } from '../../src/fixtures/ui.fixture.js';

test('whitespace-only input does not create a task', async ({ todos }) => {
  await todos.add('   ');
  await expect(todos.items).toHaveCount(0);
});

test('leading and trailing whitespace is trimmed', async ({ todos }) => {
  await todos.add('   A synthetic task   ');
  await expect(todos.titles).toHaveText(['A synthetic task']);
  await expect(todos.input).toBeEmpty();
});

test('markup in a task title is displayed as text', async ({ todos, page }) => {
  const title = '<b>Synthetic task</b>';
  await todos.add(title);
  await expect(todos.titles).toHaveText([title]);
  await expect(page.getByTestId('todo-title').locator('b')).toHaveCount(0);
});

test('titles with punctuation and Unicode remain editable', async ({ todos }) => {
  const title = 'Review "café" [demo]';
  await todos.add(title);
  await todos.rename(title, 'Review complete');
  await expect(todos.titles).toHaveText(['Review complete']);
});
