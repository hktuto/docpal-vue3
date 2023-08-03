import {api} from '../';
// schema
export const CreateSchemasApi = async(params) => {
    const res = await api.post('/nuxeo/studio/createSchemas', params, { 
        responseType: 'blob', 
        timeout: 0 
    }).then(res => res.data)
    return res
}
// 修改使用，只能修改自定义Schema，系统Schema不允许修改
export const GetCustomSchemaListApi = async() => {
    const res = await api.get('/nuxeo/studio/listCustomSchemaIDs').then(res => res.data.data)
    return res.map(item => ({name: item }))
}
// 选择使用
export const GetSchemaListApi = async() => {
    const res = await api.get('/nuxeo/studio/listSchemaIDs').then(res => res.data.data)
    return res
}
export const GetSchemaApi = async(id: string) => {
    const res = await api.get(`/nuxeo/studio/schema/${id}`).then(res => res.data.data)
    return res
}
export const UpdateSchemasApi = async(params) => {
    const res = await api.post('/nuxeo/studio/updateSchemas', params, { 
        responseType: 'blob', 
        timeout: 0 
    }).then(res => res.data)
    return res
}

// docType
export const CreateDocTypesApi = async(params) => {
    const res = await api.post('/nuxeo/studio/createDocTypes', params, { 
        responseType: 'blob', 
        timeout: 0 
    }).then(res => res.data)
    return res
}
// 修改使用，只能修改自定义DocType，系统DocType不允许修改
export const GetCustomDocTypeListApi = async() => {
    const res = await api.get('/nuxeo/studio/listCustomDocTypeIDs').then(res => res.data.data)
    return res.map(item => ({name: item }))
}
// 选择使用
export const GetFieldTypesListApi = async() => {
    const res = await api.get('/nuxeo/studio/listFieldTypes').then(res => res.data.data)
    return res
}
export const GetDocTypeApi = async(id: string) => {
    const res = await api.get(`/nuxeo/studio/docType/${id}`).then(res => res.data.data)
    return res
}
export const UpdateDocTypesApi = async(params) => {
    const res = await api.post('/nuxeo/studio/updateDocTypes', params, { 
        responseType: 'blob', 
        timeout: 0 
    }).then(res => res.data)
    return res
}

const valueStoredList = [
    { label: 'Document ID with repository prefix (default)', value: 'id' },
    { label: 'Document ID', value: 'idOnly' },
    { label: 'Document path with repository prefix', value: 'path' },
    { label: 'Document path', value: 'pathOnly' }
]
export const GetValueStoredListApi = () => {
    return valueStoredList
}
const canContainList = [
    { label: 'Both users and groups', value: 'all' },
    { label: 'Only users', value: 'group' },
    { label: 'Only groups', value: 'user' }
]
export const GetCanContainListApi = () => {
    return canContainList
}

export const complexTypeList = ['complex', 'document', 'user/group', 'directory'] // 显示setting的需要配置其他东西的文件类型
export const isComplexType = (type: string) => {
    return complexTypeList.includes(type)
}
export const fieldTypeRelatedList = { // 依后台需求根据fieldTypeId转换fieldType
    'user/group': 'User/Group Field Type',
    'directory': 'Directory Field Type',
    'document': 'Document Field Type',
    'complex': 'General Field Type',
    'blob': 'General Field Type',
    'string': 'General Field Type',
    'boolean': 'General Field Type',
    'integer': 'General Field Type',
    'double': 'General Field Type',
    'default': 'General Field Type',
}
// 下载
export const DownloadPackageTarApi = async() => {
    const res = await api.get('/nuxeo/studio/download/last/nuxeo/package', { 
        responseType: 'blob', 
        timeout: 0 
    }).then(res => res.data)
    return res
}
