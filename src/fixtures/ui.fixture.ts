import { test as base } from '@playwright/test';
import { TodoPage } from '../pages/todo.page.js';

type Fixtures = {
  todos: TodoPage;
  initialTodos: string[];
};

export const test = base.extend<Fixtures>({
  initialTodos: [[], { option: true }],
  todos: async ({ page, initialTodos }, use) => {
    const todos = new TodoPage(page);
    await todos.open();
    for (const title of initialTodos) await todos.add(title);
    await use(todos);
    // Playwright disposes this test's browser context, including local storage.
  },
});

export { expect } from '@playwright/test';
