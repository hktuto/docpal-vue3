

export function customLayer():string[] {
    const packages:string[] = [];

    // default style
    
    // all stores
    

    
    packages.push('../../packages/client-browse');
    packages.push('../../packages/client-trash');
    packages.push('../../packages/client-smart-folder');
    packages.push('../../packages/client-file-request');
    packages.push('../../packages/client-share-list');
    packages.push('../../packages/client-collection');
    packages.push('../../packages/client-workflow');
    
    packages.push("../../packages/dp-stores")
    packages.push("../../packages/dp-auth")
    
    packages.push(`../../packages/layout-default`) // 有其它 extends 的要最後加入，不然會被改了


    return packages;

}
