import type { Page } from '@playwright/test';
import { clientURL } from '../url';
import {client, expect } from './index';

type Item = {
    name: string;
    parentPath: string;
}
export class BrowsePage {
    public page: Page ;
    private readonly itemToDelete: Item[] = [];

    constructor(private p: Page) {
        this.page = p;
        this.page.goto(clientURL + '/browse');
    }

    async waitForLoading() {
        // wait for loading
        await this.page.waitForTimeout(500);
        await this.page.waitForSelector('.el-loading-spinner', {state: "detached"});

    }

    async addFolder(name:string) {
        await this.page.locator('#newActionButton').click();
        await this.page.getByRole('menuitem', { name: 'New Folder' }).click();
        await this.page.getByLabel('File Name').fill(name);
        await this.page.getByRole('button', { name: 'Submit' }).click();
        await this.addItemToDelete(name)
        await expect(this.page.getByRole('cell', { name })).toHaveCount(1);
    }

    async addItemToDelete(name:string) {
        const url = await this.page.url();
        const urlObj = new URL(url);
        // check name is not in the list
        const exist = await this.itemToDelete.find(item => item.name === name);
        if(exist) return;
        this.itemToDelete.push({
            name: name,
            parentPath: urlObj.searchParams.get('path') as string
        });
    }

    async openInfoPanel() {
        await this.page.locator('#infoActionButton').getByRole('img').click();
        const infoContainer = await this.page.locator('.right > .infoContainer');
  
        await expect(infoContainer).toHaveClass(/infoOpened/);
    }

    async goRoot() {
        await this.page.locator('.breadItem').first().click();
    }
    async goToFirstLevel() {
        const firstItemInTable = await this.page.locator('.nameContainer > .dropzone').first()
        const title = await firstItemInTable.innerText();
        await firstItemInTable.dblclick();
        await expect(this.page.locator('.breadContainer').filter({ hasText: title })).toHaveCount(1);
    }

    async updateNameInItemToDelete(oldName: string, newName: string) {
        const item = this.itemToDelete.find(item => item.name === oldName);
        if(item) {
            item.name = newName;
        }
    };

    async checkTextExist(text: string) {
        await expect(this.page.getByText(text)).toHaveCount(1);
    }

    async deleteItem(item: Item) {
        if(!item.parentPath) {
            return;
        }
        await this.page.goto(clientURL + `/browse?path=${item.parentPath}`);
        await expect(this.page.locator('.clientPageContainer')).toHaveCount(1);
        await this.waitForLoading();
        await this.page.getByPlaceholder('Name').fill(item.name);
        expect(this.page.locator('.nameContainer > .label').filter({ hasText: item.name })).toHaveCount(1);
        await this.page.getByRole('cell', { name: item.name }).click({
            button: 'right'
        });
        await this.page.getByRole('menuitem', { name: 'Delete' }).click();
        await this.page.getByRole('button', { name: 'OK' }).click();
        // wait for popup
        
        await expect(this.page.getByText('Item deleted')).toHaveCount(1);
        // go to trash
        await this.page.goto(clientURL + '/trash');
        await expect(this.page.locator('.clientPageContainer')).toHaveCount(1);
        await this.page.getByRole('button', { name: 'Delete All' }).click();
        await this.waitForLoading()
    }

    async removeAll() {
        const p:any[] = [];
        for( let i in this.itemToDelete) {
            p.push(this.deleteItem(this.itemToDelete[i]))
        }
        await Promise.all(p);
    }
}
