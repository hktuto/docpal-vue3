import {Page} from "@playwright/test";

export const changeLanguage = async (page: Page, language: string) => {
    await page.locator('.languageSwitchContainer').click();
    const isClickable = await page.getByRole('menuitem', { name: language }).getAttribute('aria-disabled');
    
    if(!isClickable || isClickable === 'false') {
        await page.getByRole('menuitem', {name: language}).click();
    }
    
}