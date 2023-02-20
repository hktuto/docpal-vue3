
import { availableLocales } from './../makeI18nSetting';

export default defineNuxtPlugin(async({
    vueApp:{
        __VUE_I18N__:{
            global
        }
    },
    $config
}) => {
    const localeKey = $config.public.LOCAL_KEY.split(',');
    const baseUrl = $config.public.PROXY;
    for await ( const lang of availableLocales) {
        // get locale 
        const language = await getLocalMessage(lang, localeKey, baseUrl);
        if(language) {
            global.setLocaleMessage(lang, language);
        }
        
    }
    
})

async function getLocalMessage (locale, localeKey, baseUrl) {
    const newLanguage = {}
    for await ( const key of localeKey) {
        try {
            // @ts-ignore
            const {data} = await api(`/api/docpal/relation/queryLanguage?locale=${locale}&languageKey=${key}`)
            data.forEach( item => {
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
