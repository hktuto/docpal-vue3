import {api} from '../';
import { pageParams, paginationResponse,sfloderDetail, paginationResponseData } from '../model';
export const sfolderGetApi = async():Promise<sfloderDetail[]> => {
    return api.get<sfloderDetail[]>('/nuxeo/sfolder/').then(res => res.data);
}
export const nestedSearchApi = async(params: pageParams):Promise<paginationResponseData> => {
    const paramCopy = JSON.parse(JSON.stringify(params))
    Object.keys(paramCopy).forEach((key) => {
        if ((!paramCopy[key] || 
            paramCopy[key] instanceof Array &&  paramCopy[key].length === 0)
            && key !== 'currentPageIndex') delete paramCopy[key]
    })
    const res = await api.post('/nuxeo/search/nestedSearch', paramCopy).then(res => res.data.data)
    
    return { entryList: res.entryList || [], totalSize: res.totalSize }
}
