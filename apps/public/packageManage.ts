

export function customLayer():string[] {
    const packages:string[] = [];

    // default style
    
    // all stores
    

    
    packages.push('../../packages/public-upload');
    packages.push('../../packages/public-share');
    
    packages.push("../../packages/dp-stores")
    packages.push("../../packages/dp-auth")
    
    packages.push(`../../packages/layout-default`) // 有其它 extends 的要最後加入，不然會被改了


    return packages;

}
