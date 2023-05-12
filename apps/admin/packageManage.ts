

export function customLayer():string[] {
    const packages:string[] = [];

    // default style
    
    // all stores
    packages.push('../../packages/admin-acl');
    packages.push('../../packages/admin-audit');
    packages.push('../../packages/admin-bulk-import-config');
    packages.push('../../packages/admin-doc-template');
    packages.push('../../packages/admin-doc-type-manage');
    packages.push('../../packages/admin-docker-log');
    packages.push('../../packages/admin-log-manage');
    packages.push('../../packages/admin-message-queue');
    packages.push('../../packages/admin-meta-manage');
    packages.push('../../packages/admin-pre-search-config');
    packages.push('../../packages/admin-share-list');
    // packages.push('../../packages/admin-table-setting');
    packages.push('../../packages/admin-user-manage');
    packages.push('../../packages/admin-vocabulary');
    packages.push('../../packages/admin-workflow-form');
    packages.push('../../packages/admin-workflow-manage');
    
    packages.push("../../packages/dp-stores")
    packages.push("../../packages/dp-auth")
    
    packages.push(`../../packages/layout-default`) // 有其它 extends 的要最後加入，不然會被改了


    return packages;
}
