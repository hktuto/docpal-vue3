

export function customLayer():string[] {
    const packages:string[] = [];

    // default style
    
    // all stores

    
    packages.push("../../dp-stores")
    packages.push("../../dp-auth")
    packages.push("../../dp-browse")
    packages.push(`../../layout-default`) // 有其它 extends 的要最後加入，不然會被改了


    return packages;

}
