

export function customLayer():string[] {
    const packages:string[] = [];

    // default style
    packages.push(`../../packages/${process.env.STYLE || 'default-layout'}`)

    // all stores
    packages.push("../../packages/dp-stores")


    packages.push('../../packages/dp-browse');
    

    return packages;

}
