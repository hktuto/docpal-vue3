import type { Page } from '@playwright/test';
import { clientURL } from '../url';
import {client, expect } from './index';

type Item = {
    name: string;
    parentPath: string;
}
export class WorkflowPage {
    public page: Page ;

    constructor(private p: Page) {
        this.page = p;
        this.page.goto(clientURL + '/workflow');
    }

    async waitForLoading() {
        // wait for loading
        await this.page.waitForTimeout(500);
        await this.page.waitForSelector('.el-loading-spinner', {state: "detached"});

    }


}