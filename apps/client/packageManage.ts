

export function customLayer():string[] {
    const packages:string[] = [];

    // all stores
    packages.push("../../packages/dp-stores")

    // all components
    packages.push("../../packages/dp-components")

    // default style
    packages.push(`../../packages/${process.env.STYLE || 'defaultAssets'}`)

    packages.push('../../packages/dp-browse');

    return packages;

}

export function makeMenu():string[] {
    const menu:string[] = [];
    return menu;
}