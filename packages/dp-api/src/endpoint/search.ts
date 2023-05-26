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
    _params.textSearchType = _params.textSearchType || 'full text search'
    _params.assetType = _params.assetType === 'All' ? "" : _params.assetType;
    _params.includeFolder = _params.includeFolder === '1' || _params.includeFolder === 1;
    _params.hight = !_params.hight ? null : Array.isArray(_params.hight)  ? _params.height : [_params.hight] ;
    _params.width = !_params.width ? null : Array.isArray(_params.width)  ? _params.width : [_params.width] ;
    _params.duration = !_params.duration ? null : Array.isArray(_params.duration)  ? param.duration : [param.duration];
    _params.mimeType = !_params.mimeType ? null : Array.isArray(_params.mimeType)  ? param.mimeType : [param.mimeType];
    const res = await api.post('/nuxeo/search/nestedSearch', _params).then(res => res.data.data)
    
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
        .then(res => res.data.data)
        .then( data => data.items.map(i => {
            if(i.type === 'vendor'){
                i.isFolder = true;
            }
            return i
         })
        )
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
