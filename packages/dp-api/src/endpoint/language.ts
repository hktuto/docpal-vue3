
import {api} from '../';
type qLanguage = {
    id: number,
    languageContent: string,
    languageKey: string,
    locale: string,
}
export const GetLanguageApi = async(locale: string, languageKey: string) => {
    const data = await api.get(`/docpal/relation/queryLanguage?locale=${locale}&languageKey=${languageKey}`, {
        headers: { 'noRouteErrorPage' : "true" }
    }).then(res=>res.data.data)
    console.log('???????????????????');
    
    if(data[0]) return {
        ...data[0],
        languageContent: JSON.parse(data[0].languageContent),
    }
    else return {}
}
export const SetLanguageApi = async(params: qLanguage) => {
    const data = await api.post('/docpal/relation/updateLanguage', params ).then(res=>res.data.result)
    return data
}
