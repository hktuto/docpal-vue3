import {api} from '../';
import { pageParams, SearchFilter, paginationResponse,sfloderDetail, paginationResponseData, Response } from '../model';
export const sfolderGetApi = async():Promise<sfloderDetail[]> => {
    return api.get<Response<sfloderDetail[]>>('/nuxeo/sfolder/').then(res => res.data.data);
}
export const nestedSearchApi = async(params: SearchFilter):Promise<paginationResponseData> => {
    const _params = JSON.parse(JSON.stringify(params))
    Object.keys(_params).forEach((key) => {
        if ((!_params[key] || 
            _params[key] instanceof Array &&  _params[key].length === 0)
            && key !== 'currentPageIndex'
            && _params[key] != '0') delete _params[key]
    })
    delete _params.time
    delete _params.searchBackPath
    const res = await api.post('/nuxeo/search/nestedSearch', _params).then(res => res.data.data)
    
    return { entryList: res.entryList || [], totalSize: res.totalSize }
}

export const getSearchParamsArray = (searchParams: SearchFilter) =>{
    const arrParams = ['paramsInTextSearch' ,'or', 'type', 'authors', 'collections', 'tags']
    const result:any = Object.keys(searchParams).reduce((prev, key) => {
        if(arrParams.includes(key) && typeof(searchParams[key]) === 'string' && searchParams[key]) {
            prev[key] = [searchParams[key]]
        }
         else {
            prev[key] = searchParams[key]
        }
        return prev
    }, {})
    console.log({result}, 2);
    
    result.textSearchType = result.textSearchType || 'full text search'
    result.assetType = result.assetType === 'All' ? "" : result.assetType;
    result.includeFolder = result.includeFolder === '1' || result.includeFolder === 1 || result.includeFolder === true|| result.includeFolder === 'true';
    result.hight = !result.hight ? null : Array.isArray(result.hight)  ? result.height : [result.hight] ;
    result.width = !result.width ? null : Array.isArray(result.width)  ? result.width : [result.width] ;
    result.duration = !result.duration ? null : Array.isArray(result.duration)  ? result.duration : [result.duration];
    result.mimeType = !result.mimeType ? null : Array.isArray(result.mimeType)  ? result.mimeType : [result.mimeType];
    return result
}

export const searchByMeta = (properties:any) => {
    return api.post('/nuxeo/document/searchByProperties', {properties})
        .then(res => res.data.data)
        .then( data => data.map(i => {
            if(i.type === 'vendor'){
                i.isFolder = true;
            }
            return i
         })
        )
}

// export
export const GetSearchExportHeaderApi = async() => {
    const res = await api.get('/nuxeo/search/getExportHeader').then(res => res.data.data)
    return res
}
export const ExportSearchCsvApi = async(params) => {
    const TimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const res = await api.post('/nuxeo/search/exportCsv', params, {
        responseType: 'blob',
        timeout: 0,
        headers: { TimeZone }
    }).then(res => res.data)
    return res
}

// pre-search-config
export const GetPreSearchListApi = async() => {
    const res = await api.get('/nuxeo/sfolder/').then(res => res.data.data)
    return res
}
export const GetPreSearchApi = async(id: string) => {
    const res = await api.get(`nuxeo/sfolder/${id}`).then(res => res.data.data)
    return res
}
export const DeletePreSearchApi = async(id: string) => {
    const res = await api.delete(`nuxeo/sfolder/${id}`).then(res => res.data.data)
    return res
}
export const UpdatePreSearchApi = async(params) => {
    const res = await api.patch('/nuxeo/sfolder/', params).then(res => res.data.data)
    return res
}
