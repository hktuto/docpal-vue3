import { api } from 'dp-api';


export default defineNuxtPlugin(() => {
    if( typeof window !== undefined) {
        // @ts-ignore
        window.$api = api;
        // @ts-ignore
        window.$getCookie = (name) => deepCopy(useCookie(name).value);
    }
})