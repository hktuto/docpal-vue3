import {Page} from "@playwright/test";


export const login = async (page: Page, username:string, password:string) => {
    // 看 url 是否有 keycloak, 有的話就是在登入頁面, 沒有的話就是在首頁
    try{
        await page.waitForURL(/.*keycloak/);
        await page.getByLabel('username').fill(username);
        await page.getByLabel('password').fill(password);
        await page.getByRole('button', {name: 'Sign In'}).press('Enter');
    } catch(e) {
        console.log('already logged in', e);
        return true;
    }
    
}