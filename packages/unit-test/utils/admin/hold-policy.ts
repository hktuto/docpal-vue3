import type { Page } from '@playwright/test';
export type HoldPolicy = {
    policyName: string,
    autoAdd: boolean,
    autoRemove: boolean,
    addApproval?: string,
    removeApproval?: string
}
export class HoldPolicyManagePage {
    public page: Page ;

    public policyName: string = 'pw_test_policyName'
    private policyNames: string[] = []
    private baseUrl: string = ''
    constructor(private p: Page, baseUrl: string) {
        this.page = p;
        this.baseUrl = baseUrl
    }
  
    async goto() {
        console.log(`goto： ${this.baseUrl}/holdPoliciesManage`);
        await this.page.goto(`${this.baseUrl}/holdPoliciesManage`);
    }

    async add(holdPolicy: HoldPolicy) {
        this.policyNames.push(holdPolicy.policyName)
        console.log('add:',holdPolicy.policyName);
        // await this.page.goto(`${this.baseUrl}/holdPoliciesManage`);
        await this.page.getByRole('button', { name: 'Add' }).click();
        await this.page.getByLabel('Policy Name').click(); 
        await this.page.getByLabel('Policy Name').fill(holdPolicy.policyName);
        if (!holdPolicy.autoAdd) {
            await this.page.locator('.add-auto .el-switch').click();
            await this.page.locator('.add-reason .el-switch').click();
            await this.page.locator('.add-approval .el-input__inner').click();
            await this.page.locator('.add-approval .el-input__inner').fill('Administrator');
            await this.page.locator('.add-approval .el-input__inner').press('Enter')
        }
        if(!holdPolicy.autoRemove) {
            await this.page.locator('.remove-auto .el-switch').click();
            await this.page.locator('.remove-reason .el-switch').click();
            await this.page.locator('.remove-approval .el-input__inner').click();
            await this.page.locator('.remove-approval .el-input__inner').fill('Administrator');
            await this.page.locator('.remove-approval .el-input__inner').press('Enter')
        }
        await this.page.getByRole('button', { name: 'Submit' }).click();
    }
    async activeHold(policyName: string) {
        console.log('active:',policyName);
        const reg = new RegExp( `^${policyName}.*`)
        await this.page.getByRole('row', { name: reg }).locator('span').nth(3).click();
        await this.page.getByRole('row', { name: reg }).locator('span').nth(3).click();
    }
    async remove(policyName: string) {
        console.log('remove:',policyName);
        const reg = new RegExp( `^${policyName}.*`)
        await this.page.getByRole('row', { name: reg }).getByRole('button').click();
        await this.page.getByRole('button', { name: 'OK' }).click();
    }
    async edit(policyName: string) {
        console.log('edit:', policyName)
        await this.page.getByText(policyName, { exact: true }).dblclick();
        await this.page.getByRole('button', { name: 'Submit' }).click();
    }
  
    async removeAll(policyNames?: string []) {
        if(!policyNames) policyNames = this.policyNames
        // this.policyNames = ['ut_AA','ut_AD','ut_DA','ut_DD']
        for( let i in policyNames) {
            await this.remove(policyNames[i])
        }
    }
}
export const hd_data = {
    AA: {
        policyName: 'ut_AA',
        autoAdd: true,
        autoRemove: true
    },
    AD: {
        policyName: 'ut_AD',
        autoAdd: true,
        autoRemove: false,
        removeApproval: 'Administrator'
    },
    DA: {
        policyName: 'ut_DA',
        autoAdd: false,
        autoRemove: true,
        addApproval: 'Administrator'
    },
    DD: {
        policyName: 'ut_DD',
        autoAdd: false,
        autoRemove: false,
        addApproval: 'Administrator',
        removeApproval: 'Administrator'
    }
}
