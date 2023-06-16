import { defineStore } from 'pinia'
import { availableLocales } from 'i18n/makeI18nSetting';
import { GetLanguageApi, SetLanguageApi } from 'dp-api'
export const useLanguage = defineStore('Language', () => {
// export const useLanguage = () => {
    const ignoreList:string[] = ['en-US', 'zh-CN', 'zh-HK']
    const route = useRoute()
    const languageKeys = new Set<string>()
    const localeSectionKeys = useNuxtApp().$config.public.LOCAL_KEY.split(',');
    
    const languageStores = new Map();
    const languageKeysStores = new Map();

    function addLanguageKeys (key: string) {
        languageKeys.add(key)
    }
    function getLanguageKeys () {
        return [...languageKeys].filter(key => !ignoreList.includes(key))
    }
    function getLanguageList (keys: string[]) {
        return keys.reduce((prev: any[], key: string) => {
            if (languageKeysStores.has(key)) {
                prev.push(languageKeysStores.get(key))
            }
            return prev
        }, [])
    }

    async function getLanguageListStore (locales: string[] = availableLocales, sections: string[] = localeSectionKeys) {
        let pList: any = []
        locales.forEach((code: string) => {
            sections.forEach(async(section: string) => {
                pList.push(getLanguage(code, section))
            })
        })
        await Promise.all(pList)
        return [...languageKeysStores.values()]
    }
    async function getLanguage (code:string, section:string) {
        const res = await GetLanguageApi(code, section)
        languageStores.set(getStoreKey(code, section), res)
        Object.keys(res.languageContent).forEach((key: string) => {
            if (languageKeysStores.has(key)) {
                const data = languageKeysStores.get(key)
                data[code] = res.languageContent[key]
            } else {
                languageKeysStores.set(key, {
                    key,
                    [code]: res.languageContent[key],
                    section
                })
            }
        })
    }
    function getStoreKey (code:string, section:string) {
        return code + '-' + section
    }
    async function setLanguageStores (row: any) {
        let pList: any = []
        
        availableLocales.forEach((code) => {
            const data = languageStores.get(getStoreKey(code, row.section))
            if(data.languageContent[row.key] !== row[code]) {
                data.languageContent[row.key] = row[code]
                data.languageContent = JSON.stringify(data.languageContent)
                pList.push(handleSetLanguage(data, {code, section: row.section}))
            }
        })
        if (pList.length === 0) return
        let result = await Promise.all(pList)
        const locales: string[] = []
        const sections: string[] = []
        result.forEach(item => {
            locales.push(item.code)
            sections.push(item.section)
        })
        await new Promise((resolve:any) => setTimeout(async() => {
            await restored(locales, sections)
            resolve()
        }, 800)) 
    }
    async function restored (locales: string[], sections: string[]) {
        const i18n: any = useNuxtApp().$i18n
        await getLanguageListStore(locales, sections)
        // console.log(languageStores);
        locales.forEach(locale => {
            const newLanguage = {}
            localeSectionKeys.forEach( (section:any) => {
                const data = languageStores.get(getStoreKey(locale, section))
                Object.assign(newLanguage, data.languageContent);
            })
            i18n.setLocaleMessage(locale, newLanguage);
        })
    }
    function handleSetLanguage (data: any, params: any) {
        const res = SetLanguageApi(data)
        return params
    }
    watch(() => route.path, () => {
        languageKeys.clear()
    })
    return {
        languageKeys,
        languageKeysStores,
        addLanguageKeys,
        getLanguageKeys,
        
        getLanguageList,
        getLanguageListStore,

        setLanguageStores
    }
})
