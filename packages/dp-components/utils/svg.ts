const iconModules = import.meta.glob("../../public/icons/**/*.svg")
export function getIconList () {
    const iconListObj:any = {
        'common': {
            name: 'common',
            children: []
        }
    }
    Object.keys(iconModules).forEach((key) => {
        const regexName = /(?<=\.\.\/public\/icons)(.+?)(?=\.svg)/g
        // @ts-ignore
        const regexResult:any = key.match(regexName)[0]
        const src = key.replace(/\.\.\/\.\.\/public/, '')
        const names = regexResult.split('/').filter((name: string) => name)
        let _iconList:any = iconListObj['common'].children
        names.forEach((name:string, index: number) => {
            if (names.length === 1) {
                _iconList.push({ name, src })
            }
            else if (names.length - 1 === index) {
                _iconList.push({ name, src })
            } else {
                if(!iconListObj[name]) iconListObj[name] = {
                    name,
                    children: []
                }
                _iconList = iconListObj[name].children
            }
        })
    })
    return Object.keys(iconListObj).reduce((prev: any[],key) => {
        prev.push(iconListObj[key])
        return prev
    }, [])
}
export const svgIconList = getIconList()
