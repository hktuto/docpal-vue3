const jsonModules = import.meta.globEager("./**/*.json")
export function getJsonListApi () {
    const data = Object.keys(jsonModules).reduce((prev,key) => {
        const name = key.replace(/\.\//, '')
        prev[name] = jsonModules[key].default
        return prev
    }, {})
    return data
}
export const jsonList = getJsonListApi()
export function getJsonApi (key) {
    return jsonList[key]
}
console.log({jsonList})
console.log(getJsonApi('clientPictureForm.json'))
