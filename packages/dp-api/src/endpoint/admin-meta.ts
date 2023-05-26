import {api} from '../';
export type metaData = {
    [docType: string]: metaSetting
}
export type metaSetting = {
    documentType?: string,
    isFolder?: boolean,
    displayMeta?: metaRule[],
    related?: relatedMetaDoc[],
    mappingMeta?: any,
    bulkImportConfigs?: string []
}
export type relatedMetaDoc = {
    meta: string,
    type: string,
    visible?: boolean
}
export type metaRule = {
    id?: string,
    documentType?: string,
    metaData?: string,
    length?: string,
    isRequire?: boolean,
    vocabulary?: string,
    display?: boolean,
    creatorId?: string,
    creatorName?: string,
    modifiedName?: string,
    modifiedId?: string
}
export type SaveMetadataMappingReq = {
    documentType: metaMapping[]
}
export type metaMapping = {
    createTime?: string,
    createUserId?: string,
    createUserName?: string,
    id?: string | number,
    metaDataMapper?: string,
    name?: string,
    updateTime?: string,
    updateUserId?: string,
    updateUserName?: string,
    version?: string,
}
let metaSettingData: metaData = null
export const GetMetaSettingsApi = async(refresh: boolean = false):Promise<metaData> => {
    if(!!metaSettingData && !refresh) return deepCopy(metaSettingData) 
    const res = await api.get('/nuxeo/admin/setting').then(res => res.data.data)
    metaSettingData = JSON.parse(res) 
    return deepCopy(metaSettingData)
}
export const PutMetaSettingApi = async(params: metaData) => {
    const res = api.put('/nuxeo/admin/setting', params).then(res => res.data.data)
    await new Promise(resolve => setTimeout(async () => {
        await GetMetaSettingsApi(true)
        resolve(500)
    }, 500))
    return res
}
export const AddMetaSettingApi = async(params: metaSetting) => {
    await GetMetaSettingsApi()
    metaSettingData[params.documentType] = {
        isFolder: params.isFolder,
        related: []
    }
    // 数据错误处理
    // delete metaSettingData.ContractFile.displayMeta
    return await PutMetaSettingApi(metaSettingData)
}
/**
 * GetMetaSettingsApi 获取 related list
 * GetMetaValidationRuleApi 获取 displayMeta list
 * @returns 
 */
export const GetMetaSettingList = async():Promise<metaSetting[]> => {
    await GetMetaSettingsApi()
    const res = await GetMetaValidationRuleApi()
    const metaList:metaSetting[] = res.reduce((prev, item) => {
        let _item = item
        const _index = prev.findIndex((prevItem) => prevItem.documentType === item.documentType)
        if (_index !== -1) {
            _item = prev[_index]
            _item.displayMeta.push({ meta: item.metaData, display: item.display })
        } else {
            _item.displayMeta = []
            _item.displayMeta.push({ meta: item.metaData, display: item.display })
            prev.push(_item)
        }
        return prev
    }, [])
    Object.keys(metaSettingData).forEach(key => {
        const item = metaList.find((prevItem) => prevItem.documentType === key)
        if(!!item) item.related = metaSettingData[item.documentType].related
        else {
        // else if(metaSettingData[key].related && metaSettingData[key].related.length > 0){
                metaList.push({ ...metaSettingData[key], documentType: key })
        }
    })
    return metaList.sort((a,b)=> (a.documentType.localeCompare(b.documentType) ))
}
export const GetMetaSettingApi = async(docType: string) => {
    await GetMetaSettingsApi()
    return { ...metaSettingData[docType], name: docType }
}
export const SetRelatedTypeApi = async(params: relatedMetaDoc, docType: string) => {
    await GetMetaSettingsApi()
    const related = metaSettingData[docType].related
    let relatedItem = related.find(item => item.type === params.type)
    if (!relatedItem) related.push(params)
    else relatedItem.meta = params.meta
    return await PutMetaSettingApi(metaSettingData)
}
export const DeleteRelatedTypeApi = async(params: relatedMetaDoc, docType: string) => {
    await GetMetaSettingsApi()
    const index = metaSettingData[docType].related.findIndex(item => item.type === params.type)
    metaSettingData[docType].related.splice(index, 1)
    return await PutMetaSettingApi(metaSettingData)
}

export const GetMetaValidationRuleApi = async(params?: metaRule) => {
    try {
        return api.get('/docpal/workflow/queryMetaValidationRule', { params }).then(res => res.data.data)
    } catch (error) {
        return []
    }
} 
export const DeleteMetaValidationRuleApi = async(id: string) => {
    return api.delete('/docpal/workflow/deleteMetaValidationRuleById', { params: { id } }).then(res => res.data.data)
} 
export const SaveMetaValidationRuleApi = async(params: metaRule) => {
    return api.post('/docpal/workflow/saveMetaValidationRule',  params ).then(res => res.data.data)
} 

// bulk import config
/**
 * GetMetaSettingsApi 获取 等待配置的列表
 * GetMetaMappingApi 获取映射meta
 * GetDocumentTypeProfileApi 获取 bulk import config
 * @returns 
 */
export const GetBulkImportConfigList = async():Promise<metaSetting[]> => {
    await GetMetaSettingsApi()
    const metaList:metaSetting[] = []
    Object.keys(metaSettingData).forEach(key => {
        metaList.push({ ...metaSettingData[key], documentType: key })
    })
    const metaMappingList = await GetMetaMappingApi()
    const documentTypeProfileList = await GetDocumentTypeProfileApi()
    metaMappingList.forEach(item => {
        if (!!item.metaDataMapper) {
            const _item = metaList.find(metaItem => metaItem.documentType === item.name)
            if (!!_item) {
                _item.mappingMeta = JSON.parse(item.metaDataMapper)
            }
        }
    })
    documentTypeProfileList.forEach(item => {
        if (item.profileName) {
            const _item = metaList.find(metaItem => metaItem.documentType === item.documentType)
            if (!!_item) {
                if(!_item.bulkImportConfigs)  _item.bulkImportConfigs = []
                _item.bulkImportConfigs.push(item.profileName)
            }
        }
    })
    return metaList.sort((a,b)=> (a.documentType.localeCompare(b.documentType) ))
}
export const GetMetaMappingApi = async(params?: metaRule) => {
    try {
        return api.get('/docpal/workflow/queryMetadataMapping', { params }).then(res => res.data.data)
    } catch (error) {
        return []
    }
} 
export const GetDocumentTypeProfileApi = async(params?: metaRule) => {
    try {
        return api.get('/docpal/workflow/queryDocumentTypeProfile', { params }).then(res => res.data.data)
    } catch (error) {
        return []
    }
} 

export const SaveMetadataMappingApi = async(params?: SaveMetadataMappingReq) => {
    try {
        return api.post('/docpal/workflow/saveMetadataMapping', params ).then(res => res.data.data)
    } catch (error) {
        return []
    }
} 
export const SaveDocumentTypeProfileApi = async(params) => {
    try {
        return api.post('/docpal/workflow/saveDocumentTypeProfile', params ).then(res => res.data.data)
    } catch (error) {
        return []
    }
}
export const DeleteDocumentTypeProfileApi = async(profileID) => {
    return api.delete('/docpal/workflow/deleteDocumentTypeProfile', { params: { profileID } }).then(res => res.data.data)
}
export const checkNameOrTitleApi = async(params) => {
    try {
        return api.post('/docpal/workflow/checkNameOrTitle', params ).then(res => res.data.data)
    } catch (error) {
        return []
    }
}
export const deepCopy  = (data:any) => {
    if (!data) return {}
    return JSON.parse(JSON.stringify(data));
}
