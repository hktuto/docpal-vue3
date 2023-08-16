import type { Page } from '@playwright/test';
export class SettingsPage {
    public page: Page ;
    constructor(page: Page) {
      this.page = page;
    }
    async switchToENG () {}
    async switchToDarkMode() {
      // ...
    }
}
