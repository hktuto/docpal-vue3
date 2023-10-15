import { test } from '@playwright/test';
import { client, expect } from '../../../utils/client';
import { clientURL } from '../../../utils/url';

test.describe('collections', () => {
   
    client('new collection, remove collection ', async ({collectionPage}) => {
        const newCollectionName = 'new collection_' + Date.now();

        await collectionPage.page.getByRole('button', { name: 'New Collection' }).click();
        await collectionPage.page.getByLabel('Name', { exact: true }).click();
        await collectionPage.page.getByLabel('Name', { exact: true }).fill(newCollectionName);
        await collectionPage.page.getByRole('button', { name: 'Save' }).click();
        
        await collectionPage.page.getByTitle(newCollectionName).click();
        await collectionPage.page.locator('.collection-item.current > i').first().click();
        await collectionPage.page.getByRole('button', { name: 'OK' }).click();

    })

})