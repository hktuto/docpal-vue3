const jsonModules = import.meta.globEager("./**/*.json")
export function getFormJsonListApi () {
    console.log(jsonModules);
    const data = Object.keys(jsonModules).reduce((prev: any,key) => {
        const name = key.replace(/\.\//, '')
        prev[name] = jsonModules[key].default
        return prev
    }, {})
    return data
}
export const formJsonList: any = getFormJsonListApi()
export function getJsonApi (key: string) {
    return formJsonList[key]
}

export function saveJsonApi (jsonName: any, data: any) {
    
    console.log(jsonName, data);
    const file = `./${jsonName}`
}

// console.log({formJsonList})
// console.log(getJsonApi('clientPictureForm.json'))
