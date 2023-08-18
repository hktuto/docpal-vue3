import type { Page } from '@playwright/test';
import {client, expect } from './index';
import { HoldPolicy } from '../admin/hold-policy'
type Item = {
    name: string;
    parentPath: string;
}
export class BrowseHoldPage {
    public page: Page ;
    public settingPage: any ;
    private readonly itemToDelete: Item[] = [];

    constructor(private p: Page, private sPage: any) {
        this.page = p;
        this.settingPage = sPage
    }
    // #region module: file
        async addFolder (name:string) {
            await this.page.locator('#newActionButton').click();
            await this.page.getByRole('menuitem', { name: 'New Folder' }).click();
            await this.page.getByLabel('File Name').fill(name);
            await this.page.getByRole('button', { name: 'Submit' }).click();
            await this.addDocToDelete(name)
            await expect(this.page.getByRole('cell', { name: name })).toHaveCount(1);
        }
        async addDocToDelete(name:string) {
            const url = await this.page.url();
            const urlObj = new URL(url);
            this.itemToDelete.push({
                name: name,
                parentPath: urlObj.searchParams.get('path') as string
            });
        }
        async goToFirstLevel() {
            const firstItemInTable = await this.page.locator('.nameContainer > .dropzone').first()
            const title = await firstItemInTable.innerText();
            await firstItemInTable.dblclick();
            await expect(this.page.locator('.breadContainer').filter({ hasText: title })).toHaveCount(1);
        }

        async deleteDoc(item: Item) {
            if(!item.parentPath) {
                return;
            }
            await this.settingPage.goto(`/browse?path=${item.parentPath}`);
            await this.page.getByPlaceholder('Name').fill(item.name);
            await this.page.getByRole('cell', { name: item.name }).click({
                button: 'right'
            });
            await this.page.getByRole('menuitem', { name: 'Delete' }).click();
            await this.page.getByRole('button', { name: 'OK' }).click();
        }

        async removeAllDoc() {
            for( let i in this.itemToDelete) {
                await this.deleteDoc(this.itemToDelete[i])
            }
        }
    // #endregion

    // #region module: hold
        async docAddHold(holdPolicy: HoldPolicy) {
            await this.page.locator('.hd-lock-img').click();
            await this.page.getByRole('menuitem', { name: holdPolicy.policyName }).click();
            if (!holdPolicy.autoAdd) {
                await this.page.getByLabel('Apply Reason').fill('Apply Reason');
                await this.page.getByRole('button', { name: 'Submit' }).click();
            }
        }
        async docRemoveHold(holdPolicy: HoldPolicy) {
            await this.page.locator('.hd-unlock-img').click();
        }
    // #endregion
}
