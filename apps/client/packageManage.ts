

export function customLayer():string[] {
    const packages:string[] = [];

    // page
    packages.push('../../pages/client-browse');
    packages.push('../../pages/client-file-request');
    packages.push('../../pages/client-smart-folder');
    packages.push('../../packages/dp-search');
    packages.push('../../pages/client-workflow');
    packages.push('../../pages/client-folder-cabinet');
    packages.push('../../pages/client-share-list');
    packages.push('../../pages/client-share-me');
    packages.push('../../pages/client-share-other');
    packages.push('../../pages/client-collection');
    packages.push('../../pages/client-trash');
    packages.push('../../pages/client-dashboard');
    // core
    packages.push('../../packages/dp-related-folder');
    packages.push('../../packages/dp-browse');
    packages.push('../../pages/client-hold-policies');
    packages.push('../../pages/client-retention');
    packages.push('../../pages/client-ai-upload');
    
    // all stores
    packages.push("../../packages/dp-stores")
    packages.push("../../packages/dp-auth")
    packages.push(`../../packages/office`) 
    packages.push(`../../packages/layout-default`) // 有其它 extends 的要最後加入，不然會被改了


    return packages;

}
