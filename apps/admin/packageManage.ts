 

export function customLayer():string[] {
    const packages:string[] = [];

    // default style
    
    // all stores
    
    // packages.push('../../pages/admin-retention')
    packages.push('../../packages/dp-browse');
    packages.push('../../packages/dp-search');
    packages.push("../../packages/dp-stores")
    packages.push("../../packages/dp-auth")
    packages.push("../../packages/dp-language")

    packages.push(`../../packages/layout-default`) // 有其它 extends 的要最後加入，不然會被改了


    return packages;
}
