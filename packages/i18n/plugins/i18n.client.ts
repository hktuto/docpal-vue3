// import { useAppStore } from './../../dp-stores/composables/app';

import { availableLocales } from '../makeI18nSetting';
import { api } from 'dp-api'


export default defineNuxtPlugin(async({
    $i18n,
    $config,
    $pinia
}) => {
    const localeKey = $config.public.LOCAL_KEY.split(',');
    const baseUrl = $config.public.PROXY;
    // @ts-ignore
    const appStore = useAppStore($pinia);
    
    for ( const lang of availableLocales) {
        appStore.appLoadingList.push( {key:`Set Langauge : ${lang}`, function:setLanuage($i18n, lang, localeKey, baseUrl)})
        // get locale 
    }
    
})

async function setLanuage(i18n:any, lang:string, localeKey:string[], baseUrl:string) {
    console.log("Set Language")
    const language = await getLocalMessage(lang, localeKey, baseUrl);
        if(language) {
            i18n.setLocaleMessage(lang, language);
        }
}

async function getLocalMessage (locale:string, localeKey:string[], _baseUrl:string) {
    const newLanguage = {}
    for await ( const key of localeKey) {
        try {
            // @ts-ignore
            const {data} = await api.get(`/docpal/relation/queryLanguage?locale=${locale}&languageKey=${key}`).then(res=>res.data)
            data.forEach( (item:any) => {
                const json = JSON.parse(item.languageContent);
                Object.assign(newLanguage, json);
            })
        } catch (error) {
            
        }
        // const value = item.languageContent;
        // const json = JSON.parse(value);
    }
    return newLanguage;
}
