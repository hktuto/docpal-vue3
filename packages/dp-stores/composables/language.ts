import { defineStore } from 'pinia'
import { availableLocales } from 'i18n/makeI18nSetting';
import { GetLanguageApi } from 'dp-api'
export const useLanguage = defineStore('Language', () => {
// export const useLanguage = () => {
    const ignoreList:string[] = ['en-US', 'zh-CN', 'zh-HK']
    const route = useRoute()
    const languageKeys = new Set<string>()
    const localeKey = useNuxtApp().$config.public.LOCAL_KEY.split(',');
    const languageStores = new Map();
    const languageKeysStores = new Map();
    // new Set([,,,])初始化
    // size() 长度
    // clear() 清除
    // delete() 删除
    // add() 添加
    // has() 检测是否有某个元素

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

    async function getLanguageListStore () {
        let pList: any = []
        availableLocales.forEach((code: string) => {
            localeKey.forEach(async(section: string) => {
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
    watch(() => route.path, () => {
        languageKeys.clear()
    })
    return {
        languageKeys,
        languageKeysStores,
        addLanguageKeys,
        getLanguageKeys,
        
        getLanguageList,
        getLanguageListStore
    }
})
