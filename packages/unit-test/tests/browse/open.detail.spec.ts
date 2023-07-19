import { test, expect } from '@playwright/test';

test('folder and document', () => {
  
  test('open folder', async ({page}) => {
    await page.goto('/browse');
    await page.locator('.nameContainer > .dropzone').first().dblclick();
  });
})
