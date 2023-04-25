import {api} from '../';
import { pageParams, SearchFilter, paginationResponse,sfloderDetail, paginationResponseData } from '../model';
export const sfolderGetApi = async():Promise<sfloderDetail[]> => {
    return api.get<sfloderDetail[]>('/nuxeo/sfolder/').then(res => res.data);
}
export const nestedSearchApi = async(params: SearchFilter):Promise<paginationResponseData> => {
    const paramCopy = JSON.parse(JSON.stringify(params))
    Object.keys(paramCopy).forEach((key) => {
        if ((!paramCopy[key] || 
            paramCopy[key] instanceof Array &&  paramCopy[key].length === 0)
            && key !== 'currentPageIndex'
            && paramCopy[key] != '0') delete paramCopy[key]
    })
    const res = await api.post('/nuxeo/search/nestedSearch', paramCopy).then(res => res.data.data)
    
    return { entryList: res.entryList || [], totalSize: res.totalSize }
}

export const getSearchParamsArray = (searchParams: SearchFilter) =>{
    const arrParams = ['paramsInTextSearch' ,'or', 'type', 'authors', 'collections', 'tags']
    const result = Object.keys(searchParams).reduce((prev, key) => {
        if(arrParams.includes(key) && typeof(searchParams[key]) === 'string' && searchParams[key]) {
            prev[key] = [searchParams[key]]
        }
         else {
            prev[key] = searchParams[key]
        }
        return prev
    }, {})
    return result
}

export const searchByMeta = (properties:any) => {
    return api.post('/nuxeo/document/searchByProperties', {properties})
        .then(res => res.data)
        .then( data => data.items.map(i => {
            if(i.type === 'vendor'){
                i.isFolder = true;
            }
            return i
         })
        )
}
