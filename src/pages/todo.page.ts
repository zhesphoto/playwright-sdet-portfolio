import type { Locator, Page } from '@playwright/test';

export type TodoFilter = 'All' | 'Active' | 'Completed';

export class TodoPage {
  readonly input: Locator;
  readonly items: Locator;
  readonly titles: Locator;
  readonly remaining: Locator;
  readonly clearCompleted: Locator;

  constructor(readonly page: Page) {
    this.input = page.getByPlaceholder('What needs to be done?');
    this.items = page.getByTestId('todo-item');
    this.titles = page.getByTestId('todo-title');
    this.remaining = page.getByTestId('todo-count');
    this.clearCompleted = page.getByRole('button', { name: 'Clear completed', exact: true });
  }

  async open() {
    await this.page.goto('./');
    await this.input.waitFor({ state: 'visible' });
  }

  item(title: string) {
    return this.items.filter({
      has: this.page.getByText(title, { exact: true }),
    });
  }

  async add(title: string) {
    await this.input.fill(title);
    await this.input.press('Enter');
  }

  async setCompleted(title: string, completed: boolean) {
    await this.item(title).getByRole('checkbox').setChecked(completed);
  }

  async beginEdit(title: string) {
    const item = this.item(title);
    await item.getByTestId('todo-title').dblclick();
    return item.getByRole('textbox');
  }

  async rename(title: string, replacement: string) {
    const editor = await this.beginEdit(title);
    await editor.fill(replacement);
    await editor.press('Enter');
  }

  async remove(title: string) {
    const item = this.item(title);
    await item.hover();
    await item.getByRole('button', { name: 'Delete', exact: true }).click();
  }

  async filterBy(filter: TodoFilter) {
    await this.page.getByRole('link', { name: filter, exact: true }).click();
  }
}
