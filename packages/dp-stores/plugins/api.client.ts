import { api } from 'dp-api';
import { useLanguage } from '../composables/language';
export default defineNuxtPlugin(({$i18n,_route}) => {
    const { addLanguageKeys } = useLanguage()
    if( typeof window !== undefined) {
        // @ts-ignore
        window.$api = api;
        // @ts-ignore
        window.$getCookie = (name) => {
            const cookie = useCookie(name)
            return cookie.value || {}
        }
        // @ts-ignore
        window.$i18n = $i18n
        // @ts-ignore
        window.$t = (key: string) => {
            addLanguageKeys(key)
            // @ts-ignore
            return $i18n.t(key)
        }
    }
    return {
        provide: {
            t: (key: string) => {
                // console.log(key);
                // console.log(_route.path);
                addLanguageKeys(key)
                // @ts-ignore
                return $i18n.t(key)
            }
        }
    }
})
