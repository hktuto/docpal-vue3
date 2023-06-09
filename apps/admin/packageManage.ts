

export function customLayer():string[] {
    const packages:string[] = [];

    // default style
    
    // all stores
    
    packages.push('../../pages/admin-acl');
    packages.push('../../pages/admin-audit');
    packages.push('../../pages/admin-bulk-import-config');
    packages.push('../../pages/admin-doc-template');
    packages.push('../../pages/admin-doc-type-manage');
    packages.push('../../pages/admin-docker-log');
    packages.push('../../pages/admin-log-manage');
    packages.push('../../pages/admin-message-queue');
    packages.push('../../pages/admin-meta-manage');
    packages.push('../../pages/admin-pre-search-config');
    packages.push('../../pages/admin-share-list');
    packages.push('../../pages/admin-watermark');
    packages.push('../../pages/admin-dam');
    packages.push('../../pages/admin-table-setting');
    packages.push('../../pages/admin-user-manage');
    packages.push('../../pages/admin-vocabulary');
    packages.push('../../pages/admin-workflow-form');
    packages.push('../../pages/admin-workflow-manage');
    packages.push('../../pages/admin-mail-config');
    
    packages.push('../../packages/dp-browse');
    packages.push("../../packages/dp-stores")
    packages.push("../../packages/dp-auth")
    packages.push("../../packages/dp-language")

    packages.push(`../../packages/layout-default`) // 有其它 extends 的要最後加入，不然會被改了


    return packages;
}
