
import { availableLocales } from '../makeI18nSetting';
import { api } from 'dp-api'


export default defineNuxtPlugin(async({
    $i18n,
    $config
}) => {
    const localeKey = $config.public.LOCAL_KEY.split(',');
    const baseUrl = $config.public.PROXY;
    for await ( const lang of availableLocales) {
        // get locale 
        const language = await getLocalMessage(lang, localeKey, baseUrl);
        if(language) {
            $i18n.setLocaleMessage(lang, language);
        }
        
    }
    
})

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
