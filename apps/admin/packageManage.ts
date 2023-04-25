

export function customLayer():string[] {
    const packages:string[] = [];

    // default style
    
    // all stores
    


    packages.push('../../packages/admin-table-setting');
    packages.push('../../packages/admin-log-manage');
    packages.push('../../packages/admin-user-manage');

    packages.push("../../packages/dp-stores")
    packages.push("../../packages/dp-auth")
    
    packages.push(`../../packages/layout-default`) // 有其它 extends 的要最後加入，不然會被改了


    return packages;

}
