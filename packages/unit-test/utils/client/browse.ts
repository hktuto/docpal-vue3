import type { Page } from '@playwright/test';
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
        this.page.goto('/browse');
    }

    async addFolder(name:string) {

    }

    async addItemToDelete(name:string) {
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

    async deleteItem(item: Item) {
        if(!item.parentPath) {
            return;
        }
        await this.page.goto(`/browse?path=${item.parentPath}`);
        await this.page.getByPlaceholder('Name').fill(item.name);
        await this.page.getByRole('cell', { name: item.name }).click({
            button: 'right'
        });
        await this.page.getByRole('menuitem', { name: 'Delete' }).click();
        await this.page.getByRole('button', { name: 'OK' }).click();
    }

    async removeAll() {
        for( let i in this.itemToDelete) {
           await this.deleteItem(this.itemToDelete[i])
        }
    }
}
