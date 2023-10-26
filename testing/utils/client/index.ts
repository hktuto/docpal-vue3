import { RetentionPage } from './retention';
import { HoldPage } from './hold';

import { test as base, expect } from '@playwright/test';
import { clientURL } from '../url';
import { BrowsePage } from './browse'
import {login} from "../pre-test/login";
import {changeLanguage} from "../pre-test/changeLanguage";
import { CollectionPage } from './collection';
import { CabinetPage } from './folderCabinet';
import { WorkflowPage } from './workflow';
import { SmartFolderPage } from './smartfolder';


export const client = base.extend<{} & 
    { browsePage: BrowsePage , collectionPage: CollectionPage, cabinetPage: CabinetPage, holdPage:HoldPage,
        retentionPage: RetentionPage,
        workflowPage: WorkflowPage,
        smartFolderPage: SmartFolderPage
    }>({
    page: async ({ page }, use, scope) => {
        
        await page.goto(clientURL + '/');
        await login(page, process.env.CLIENT_USER || 'Administrator', process.env.CLIENT_PASSWORD ||"2'KMzF}zK2ZmwQe");

        await expect(page).toHaveURL(/.*browse/);

        await changeLanguage(page, 'ENG'); 
        // Use signed-in page in the test.
        await use(page);
    },
    browsePage: async ({ page }, use, scope) => {
        const browsePage = new BrowsePage(page);
        await use(browsePage);
        await browsePage.removeAll();
    },
    collectionPage: async ({ page }, use, scope) => {
        const collectionPage = new CollectionPage(page);
        await use(collectionPage);
    },
    cabinetPage: async ({ page }, use, scope) => {
        const cabinetPage = new CabinetPage(page);
        await use(cabinetPage);
    },
    holdPage: async ({ page }, use, scope) => {
        const holdPage = new HoldPage(page);
        await use(holdPage);
    },
    retentionPage: async ({ page }, use, scope) => {
        const retentionPage = new RetentionPage(page);
        await use(retentionPage);
    },
    workflowPage: async ({ page }, use, scope) => {
        const workflowPage = new WorkflowPage(page);
        await use(workflowPage);
    },
    smartFolderPage: async ({ page }, use, scope) => {
        const smartFolderPage = new SmartFolderPage(page);
        await use(smartFolderPage);
    },

})

export { expect } from '@playwright/test';
        