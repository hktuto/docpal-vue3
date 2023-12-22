// @ts-nocheck
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
    // if(Object.keys(_params).length <= 3) return { entryList: [], totalSize: 0, aggregation: await getAggregation(null) }
    const res = await api.post('/nuxeo/search/nestedSearch', _params).then(res => res.data.data)
    return { entryList: res.page?.entryList || res.entryList || [], totalSize: res.page?.totalSize || res.totalSize || 0, aggregation: await getAggregation(res.aggregation, params) }
}
export const getAggregation = async (aggregation?, searchParams?) => {
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
    if(!aggregation) {
        return {
            'authors': aggregation === null ? await GetKeyCloakAllUsersApi() : [],
            'collections': aggregation === null ? await GetSCollectionsApi() : [],
            'creator': aggregation === null ? await GetKeyCloakAllUsersApi(): [],
            // 'duration': aggregation === null ? await GetSearchExtendsApi(searchParams.assetType, 'duration'): [],
            'includeFolder': aggregation === null ? await GetSSIncludeFolderApi(): [],
            // 'mimeType': aggregation === null ? await GetSearchExtendsApi(searchParams.assetType, 'mimeType'): [],
            'modified': aggregation === null ? await GetSModifiedDateApi(): [],
            // 'textSearchType': aggregation === null ? await GetSTextSearchTypesApi(): [],
            'type': aggregation === null ? await GetSTypesApi(): [],
            'size': aggregation === null ? await GetSSizeApi(): [],
            'tags': aggregation === null ? await GetSTagsApi(): [],
            // 'height': aggregation === null ? await GetSearchExtendsApi(searchParams.assetType, 'height'): [],
            // 'width':aggregation === null ?  await GetSearchExtendsApi(searchParams.assetType, 'width'): []
        }
    }
    const result = Object.keys(aggregation).reduce((prev, key) => {
        const aggregationItem = aggregation[key]
        const newKey = map[key]
        switch (key) {
            case 'duration_agg':
            case 'modified_agg':
            case 'size_agg':
                prev[newKey] = returnI18nArr(aggregationItem)
                break
            case 'includeFolder_agg':
                prev[newKey] = aggregationItem.map((option) => ({
                    label: option.key === 'notInclude' ? $t('searchType_includeFolder_0') : $t('searchType_includeFolder_1'),
                    value: option.key === 'notInclude' ? 'false' : 'true'
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
                        label: item.value || item.label || item.key,
                        value: item.key
                    }))
                break;
        }
        return prev
    }, {})
    function returnI18nArr(arr) {
        return arr.map(arrItem => ({
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
    if (result.includeFolder) result.includeFolder = result.includeFolder === 'true' ? true : false 
    result.height = !result.height ? null : Array.isArray(result.height)  ? result.height : [result.height] ;
    result.width = !result.width ? null : Array.isArray(result.width)  ? result.width : [result.width] ;
    result.duration = !result.duration ? null : Array.isArray(result.duration)  ? result.duration : [result.duration];
    result.mimeType = !result.mimeType ? null : Array.isArray(result.mimeType)  ? result.mimeType : [result.mimeType];
    return result
}
export const isSearchParamsEqual = (newVal, oldVal) => {
    if(!newVal || !oldVal) return false
    // delete newVal.time
    // delete oldVal.time
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
        headers: { TimeZone, 'white': 'true' }
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
        label: $t('searchType_'+item)
    }))
    return searchOptions.textSearchType
}
export const GetSAssetTypeApi = async() => {
    return [
        { label: $t('searchType_Picture'), value: 'Picture' },
        { label: $t('searchType_Video'), value: 'Video' },
        { label: $t('searchType_Audio'), value: 'Audio' }
    ]
}
export const GetSTypesApi = async() => {
    if (searchOptions.types) return searchOptions.types
    const res = await api.get('/nuxeo/types', {}).then(res => res.data.data)
    searchOptions.types = res.map(item => ({
        value: item.name,
        label: $t(item.name),
        isFolder: item.isFolder
    }))
    return searchOptions.types
}
export const GetDocListWithIsFolderApi = async(isFolder:boolean = true) => {
    const docList = await GetSTypesApi()
    return docList.filter(item => item.isFolder === isFolder)
}
export const GetKeyCloakAllUsersApi = async() => {
    if (searchOptions.users) return searchOptions.users
    const res = await api.post('/nuxeo/identity/getKeyCloakAllUsers', {}, {
        baseURL: '/client'
    }).then(res => res.data.data)
    searchOptions.users = res.map(item => ({
        value: item.userId || item.username,
        label: item.username || item.userId
    }))
    return searchOptions.users
}
export const GetSearchExtendsApi = async(primaryType, key) => {
    const res = await api.get(`/nuxeo/search/getSearchExtends?primaryType=${primaryType}`).then(res => res.data.data)
    if(!!key && res[key]) return res[key].map( item => ({
        label: ['mimeType'].includes(key) ? item : $t(`searchType_${item}`), 
        value: item
    }))
    return []
}
export const GetSModifiedDateApi = async() => {
    return [
        { label: $t('searchType_last24h'), value: 'last24h' },
        { label: $t('searchType_lastWeek'), value: 'lastWeek' },
        { label: $t('searchType_lastMonth'), value: 'lastMonth' },
        { label: $t('searchType_lastYear'), value: 'lastYear' },
        { label: $t('searchType_priorToLastYear'), value: 'priorToLastYear' }
    ]
}
export const GetSSizeApi = async() => {
    return [
        { label: $t('searchType_100'), value: '100' },
        { label: $t('searchType_1000'), value: '1000' },
        { label: $t('searchType_10000'), value: '10000' },
        { label: $t('searchType_100000'), value: '100000' },
        { label: $t('searchType_1000000'), value: '1000000' }
    ]
}
export const GetSSIncludeFolderApi = async() => {
    return [
        { label: $t('searchType_includeFolder_1'), value: 'true' },
        { label: $t('searchType_includeFolder_0'), value: 'false' },
    ]
}
export const GetSCollectionsApi = async() => {
    if (searchOptions.collections) return searchOptions.collections
    const res = await api.get('/nuxeo/collection/all', {
        baseURL: '/client'
    }).then(res => res.data.data)
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

