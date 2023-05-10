const jsonModules = import.meta.globEager("./**/*.json")
export function getFormJsonListApi () {
    console.log({jsonModules});
    
    const data = Object.keys(jsonModules).reduce((prev: any,key) => {
        const name = key.replace(/\.\//, '').replace(/\//g, '-')
        prev[name] = jsonModules[key].default
        return prev
    }, {})
    return data
}
export const formJsonList: any = getFormJsonListApi()
export function getJsonApi (key: string) {
    return formJsonList[key]
}


console.log({formJsonList})
console.log(getJsonApi('clientPictureForm.json'))
