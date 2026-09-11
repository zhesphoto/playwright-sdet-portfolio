import { test, expect } from '../../src/fixtures/ui.fixture.js';

test('create, edit, complete, and clear a task @smoke', async ({ todos }) => {
  await test.step('Create a task', async () => {
    await todos.add('Draft a synthetic release note');
    await expect(todos.titles).toHaveText(['Draft a synthetic release note']);
    await expect(todos.remaining).toHaveText('1 item left');
  });

  await test.step('Edit the task', async () => {
    await todos.rename('Draft a synthetic release note', 'Review the synthetic release note');
    await expect(todos.titles).toHaveText(['Review the synthetic release note']);
  });

  await test.step('Complete and clear the task', async () => {
    await todos.setCompleted('Review the synthetic release note', true);
    await expect(
      todos.item('Review the synthetic release note').getByRole('checkbox'),
    ).toBeChecked();
    await expect(todos.remaining).toHaveText('0 items left');
    await todos.clearCompleted.click();
    await expect(todos.items).toHaveCount(0);
  });
});

test('task text and completion survive a reload @smoke', async ({ todos, page }) => {
  await todos.add('Prepare a demo report');
  await todos.add('Review a demo report');
  await todos.setCompleted('Prepare a demo report', true);

  await page.reload();

  await expect(todos.titles).toHaveText(['Prepare a demo report', 'Review a demo report']);
  await expect(todos.item('Prepare a demo report').getByRole('checkbox')).toBeChecked();
  await expect(todos.item('Review a demo report').getByRole('checkbox')).not.toBeChecked();
  await expect(todos.remaining).toHaveText('1 item left');
});

test('a separate browser context has its own task list', async ({ todos, browser }) => {
  await todos.add('Task in the first session');
  const secondContext = await browser.newContext();
  try {
    const secondPage = await secondContext.newPage();
    await secondPage.goto(todos.page.url());
    await expect(secondPage.getByPlaceholder('What needs to be done?')).toBeVisible();
    await expect(secondPage.getByTestId('todo-item')).toHaveCount(0);
    await expect(todos.titles).toHaveText(['Task in the first session']);
  } finally {
    await secondContext.close();
  }
});
