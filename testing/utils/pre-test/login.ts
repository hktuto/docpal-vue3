import {Page} from "@playwright/test";


export const login = async (page: Page, username:string, password:string) => {
    await page.getByLabel('username').fill(username);
    await page.getByLabel('password').fill(password);
    await page.getByRole('button', {name: 'Sign In'}).press('Enter');
}