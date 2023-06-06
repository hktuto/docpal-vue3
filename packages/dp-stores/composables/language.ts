
export const useLanguage = () => {
    const ignoreList:string[] = ['en-US', 'zh-CN', 'zh-HK']
    const route = useRoute()
    const languageKeys = useState<string[]>('languageKeys', () => []);

    function addLanguageKeys (key: string) {
        languageKeys.value.push(key)
    }
    function getLanguageKeys () {
        return [...new Set(languageKeys.value)].filter(key => !ignoreList.includes(key))
    }
    watch(() => route.path, () => {
        languageKeys.value = []
    })
    return {
        languageKeys,
        addLanguageKeys,
        getLanguageKeys
    }
}
