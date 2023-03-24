import { api } from 'dp-api';

export default defineNuxtPlugin(({$i18n}) => {
    console.log($i18n);
    
    if( typeof window !== undefined) {
        // @ts-ignore
        window.$api = api;
        // @ts-ignore
        window.$getCookie = (name) => deepCopy(useCookie(name).value);
        // @ts-ignore
        window.$i18n = $i18n
    }
})