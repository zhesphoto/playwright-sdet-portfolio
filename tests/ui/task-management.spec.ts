import { test, expect } from '../../src/fixtures/ui.fixture.js';

test.use({ initialTodos: ['Prepare demo data', 'Review demo data', 'Publish demo notes'] });

test('active and completed filters reflect changes', async ({ todos }) => {
  await todos.setCompleted('Prepare demo data', true);
  await todos.filterBy('Active');
  await expect(todos.titles).toHaveText(['Review demo data', 'Publish demo notes']);

  await todos.filterBy('Completed');
  await expect(todos.titles).toHaveText(['Prepare demo data']);
  await todos.setCompleted('Prepare demo data', false);
  await expect(todos.items).toHaveCount(0);

  await todos.filterBy('All');
  await expect(todos.titles).toHaveText([
    'Prepare demo data',
    'Review demo data',
    'Publish demo notes',
  ]);
  await expect(todos.remaining).toHaveText('3 items left');
});

test('clear completed preserves active tasks', async ({ todos }) => {
  await todos.setCompleted('Prepare demo data', true);
  await todos.setCompleted('Publish demo notes', true);
  await todos.clearCompleted.click();

  await expect(todos.titles).toHaveText(['Review demo data']);
  await expect(todos.remaining).toHaveText('1 item left');
  await expect(todos.clearCompleted).toBeHidden();
});

test('deleting one task preserves the others', async ({ todos }) => {
  await todos.remove('Review demo data');
  await expect(todos.titles).toHaveText(['Prepare demo data', 'Publish demo notes']);
  await expect(todos.remaining).toHaveText('2 items left');
});

test('Escape cancels an edit', async ({ todos }) => {
  const editor = await todos.beginEdit('Review demo data');
  await editor.fill('This change should be discarded');
  await editor.press('Escape');

  await expect(todos.titles).toHaveText([
    'Prepare demo data',
    'Review demo data',
    'Publish demo notes',
  ]);
});

test('saving an empty edit removes that task', async ({ todos }) => {
  await todos.rename('Review demo data', '   ');
  await expect(todos.titles).toHaveText(['Prepare demo data', 'Publish demo notes']);
  await expect(todos.remaining).toHaveText('2 items left');
});

test('toggle all completes and reactivates every task', async ({ todos, page }) => {
  const toggleAll = page.getByLabel('Mark all as complete');
  await toggleAll.check();
  await expect(todos.items.locator('input[type="checkbox"]:checked')).toHaveCount(3);
  await expect(todos.remaining).toHaveText('0 items left');

  await toggleAll.uncheck();
  await expect(todos.items.locator('input[type="checkbox"]:checked')).toHaveCount(0);
  await expect(todos.remaining).toHaveText('3 items left');
});
