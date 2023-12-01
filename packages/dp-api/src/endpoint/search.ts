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
    return { entryList: res.page?.entryList || [], totalSize: res.page?.totalSize, aggregation: getAggregation(res.aggregation, params) }
}
export const getAggregation = (aggregation, searchParams) => {
    if(!aggregation) return {}
    const result = Object.keys(aggregation).reduce((prev, key) => {
        const aggregationItem = aggregation[key]
        const map = {
            authors_agg: 'authors',
            collections_agg: 'collections',
            creator_agg: 'creator',
            duration_agg: 'duration',
            includeFolder_agg: 'includeFolder',
            mimeType_agg: 'mimeType',
            modified_agg: 'modified',
            primaryType_agg: 'type',
            size_agg: 'size',
            tags_agg: 'tags',
            height_pic_agg: 'height',
            height_vid_agg: 'height',
            width_pic_agg: 'width',
            width_vid_agg: 'width',
        }
        const newKey = map[key]
        switch (key) {
            case 'duration_agg':
            case 'mimeType_agg':
            case 'modified_agg':
            case 'size_agg':
                prev[newKey] = returnI18nArr(aggregationItem)
                break
            case 'includeFolder_agg':
                prev[newKey] = aggregationItem.map((option) => ({
                    // @ts-ignore
                    label: option.key === 'notInclude' ? $t('searchType_includeFolder_0') : $t('searchType_includeFolder_1'),
                    value: option.key === 'notInclude' ? '0' : '1'
                }))
                break
            case 'height_pic_agg':
            case 'width_pic_agg':
                if (searchParams.assetType === 'Picture') 
                    prev[newKey] = returnI18nArr(aggregationItem)
                break
            case 'height_vid_agg':
            case 'width_vid_agg':
                if (searchParams.assetType === 'Video') 
                    prev[newKey] = returnI18nArr(aggregationItem)
                break
            default:
                if(newKey)
                    prev[newKey] = aggregationItem.map(item => ({
                        label: item.label || item.key,
                        value: item.key
                    }))
                break;
        }
        return prev
    }, {})
    function returnI18nArr(arr) {
        return arr.map(arrItem => ({
            // @ts-ignore
            label: $t(`searchType_${arrItem.key}`),
            value: arrItem.key
        }))
    }
    return result
}
export const getSearchParamsArray = (searchParams: SearchFilter) =>{
    const arrParams = ['or', 'type', 'authors', 'collections', 'tags', 'creator']
    const result:any = Object.keys(searchParams).reduce((prev, key) => {
        if(arrParams.includes(key) && typeof(searchParams[key]) === 'string' && searchParams[key]) {
            prev[key] = [searchParams[key]]
        }
         else {
            prev[key] = searchParams[key]
        }
        return prev
    }, {})
    
    result.textSearchType = result.textSearchType || 'full text search'
    result.assetType = Array.isArray(result.assetType) ? result.assetType[0] : result.assetType;
    console.log('result.includeFolder',result.includeFolder);
    
    result.includeFolder = result.includeFolder === '1' || result.includeFolder === 1 || result.includeFolder === true|| result.includeFolder === 'true';
    result.hight = !result.hight ? null : Array.isArray(result.hight)  ? result.height : [result.hight] ;
    result.width = !result.width ? null : Array.isArray(result.width)  ? result.width : [result.width] ;
    result.duration = !result.duration ? null : Array.isArray(result.duration)  ? result.duration : [result.duration];
    result.mimeType = !result.mimeType ? null : Array.isArray(result.mimeType)  ? result.mimeType : [result.mimeType];
    console.log({result}, 2);
    return result
}
export const isSearchParamsEqual = (newVal, oldVal) => {
    if(!newVal || !oldVal) return false
    delete newVal.time
    delete oldVal.time
    return JSON.stringify(newVal) === JSON.stringify(oldVal)
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
export const GetPreSearchListApi = async(params) => {
    const res = await api.get('/nuxeo/sfolder', {
        params
    }).then(res => res.data.data)
    return res
}
export const GetSFolderPageApi = async(params) => {
    const res = await api.post('/nuxeo/sfolder/page', params).then(res => res.data.data)
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
export const GetSFolderPageConditionApi = async(params) => {
    const res = await api.get('/nuxeo/sfolder/page/conditions', params).then(res => res.data.data)
    return res
}

// s form
const searchOptions: any = {
}
export const GetSTextSearchTypesApi = async() => {
    if (searchOptions.textSearchType) return searchOptions.textSearchType
    const res = await api.get('/nuxeo/search/textSearchTypes', {}).then(res => res.data.data)
    searchOptions.textSearchType = res.map(item => ({
        value: item,
        // @ts-ignore
        label: $t('searchType_'+item)
    }))
    return searchOptions.textSearchType
}
export const GetSAssetTypeApi = async() => {
    return [
        { label: 'Picture', value: 'Picture'},
        { label: 'Video', value: 'Video' },
        { label: 'Audio', value: 'Audio' },
    ]
}
export const GetSTypesApi = async() => {
    if (searchOptions.types) return searchOptions.types
    const res = await api.get('/nuxeo/types', {}).then(res => res.data.data)
    searchOptions.types = res.map(item => ({
        value: item.name,
        // @ts-ignore
        label: $t(item.name)
    }))
    return searchOptions.types
}
export const GetKeyCloakAllUsersApi = async() => {
    if (searchOptions.users) return searchOptions.users
    const res = await api.post('/nuxeo/identity/getKeyCloakAllUsers', {}).then(res => res.data.data)
    searchOptions.users = res.map(item => ({
        value: item.userId || item.username,
        label: item.username || item.userId
    }))
    return searchOptions.users
}

export const GetSModifiedDateApi = async() => {
    return [
        { label: 'Last 24h', value: 'last24h'},
        { label: 'Last week', value: 'lastWeek' },
        { label: 'Last month', value: 'lastMonth' },
        { label: 'Last year', value: 'lastYear' },
        { label: 'More than 1 year ago', value: 'priorToLastYear' },
    ]
}
export const GetSSizeApi = async() => {
    return [
        { label: 'Less than 100 KB', value: '100'},
        { label: 'Between 100 KB and 1 MB', value: '1000' },
        { label: 'Between 1 MB and 10 MB', value: '10000' },
        { label: 'Between 10 MB and 100 MB', value: '100000' },
        { label: 'More than 100 MB', value: '1000000' },
    ]
}
export const GetSCollectionsApi = async() => {
    if (searchOptions.collections) return searchOptions.collections
    const res = await api.get('/nuxeo/collection/all', {}).then(res => res.data.data)
    searchOptions.collections = res.map(item => ({
        value: item.id,
        label: item.name
    }))
    return searchOptions.collections
}
export const GetSTagsApi = async() => {
    if (searchOptions.tags) return searchOptions.tags
    const res = await api.post('/nuxeo/tags/getAllTags', {}).then(res => res.data.data)
    searchOptions.tags = res.map(item => ({
        value: item,
        label: item
    }))
    return searchOptions.tags
}

