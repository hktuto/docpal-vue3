import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
export type LoginAccountForm = {
  username: string,
  password: string
}
export class SettingsPage {
    public page: Page ;
    private baseUrl: string = ''
    constructor(page: Page, baseUrl: string) {
      this.page = page;
      this.baseUrl = baseUrl;
    }
    async login(account: LoginAccountForm) {
      await this.goto('/');
      await this.page.getByLabel('username').fill(account.username);
      await this.page.getByLabel('password').fill(account.password);
      await this.page.getByRole('button', {name: 'Submit'}).press('Enter');
      // await expect(this.page).toHaveURL(/.*browse/);
    }
    async goto(path: string) {
      await this.page.goto(`${this.baseUrl}${path}`);
    }
    async switchToENG () {}
    async switchToDarkMode() {
      // ...
    }
}
