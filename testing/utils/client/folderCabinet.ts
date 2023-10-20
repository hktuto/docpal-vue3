import type { Page } from '@playwright/test';
import { clientURL } from '../url';
import {client, expect } from './index';

type Item = {
    name: string;
    parentPath: string;
}
export class CabinetPage {
    public page: Page ;

    constructor(private p: Page) {
        this.page = p;
        this.page.goto(clientURL + '/folderCabinet');
    }


}
