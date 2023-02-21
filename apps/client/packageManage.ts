

export function customLayer():string[] {
    const packages:string[] = [];

    // default style
    packages.push(`../../packages/${process.env.STYLE || 'default-layout'}`)
    packages.push("../../packages/dp-auth")
    // all stores
    packages.push("../../packages/dp-stores")


    packages.push('../../packages/client-browse');
    

    return packages;

}
