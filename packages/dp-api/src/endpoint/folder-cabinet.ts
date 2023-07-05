import { api } from '../';
import {
    pageParams,
    paginationData,
    Response
} from '../model';
export type tpFolderCabinetSetting = {
    id: string,
    parentId?: string,
    label?: string,
    documentType?: string,
    documentPath?: string,
    folder?: boolean,
    allow?: boolean,
    multiple?: boolean,
    createdBy?: string,
    modifiedBy?: string,
    createdDate?: string,
    modifiedDate?: string,
    binds?: any,
    children?: tpFolderCabinetSetting[]
}
export const GetCabinetListApi = async() => {
    const res = await api.get('/docpal/cabinet/list').then(res => res.data.data)
    return res
}
export const MatchingTemplateApi = async(id: string) => {
    const res = await api.post('/docpal/cabinet/verification/complete', {id}).then(res => res.data.data)
    return res
}
export const GetCabinetTemplateApi = async(id: string) => {
    const res = await api.get(`/docpal/cabinet/template/${id}`).then(res => res.data.data)
    return res
}
export const PatchCabinetTemplateApi = async(params: tpFolderCabinetSetting) => {
    const res = await api.patch('/docpal/cabinet/template', params).then(res => res.data.data)
    return res
}
export const CreateCabinetTemplateApi = async(params: tpFolderCabinetSetting) => {
    const res = await api.post('/docpal/cabinet/template', params).then(res => res.data.data)
    return res
}
export const DeleteCabinetTemplateApi = async(id: string) => {
    const res = await api.delete(`/docpal/cabinet/${id}`).then(res => res.data.data)
    return res
}
export const GetCabinetPageApi = async(params: pageParams):Promise<paginationData> => {
    const res = await api.post<Response<paginationData>>('/docpal/cabinet/page', params).then(res => res.data.data)
    return res
}
export const GetCabinetSubDocumentsApi = async(params: pageParams):Promise<paginationData> => {
    const res = await api.post<Response<paginationData>>(`/docpal/cabinet/sub/documents?pageNum=${params.pageNum}&pageSize=${params.pageSize}`, params).then(res => res.data.data)
    return res
}


export const GetCabinetLoginUserListApi = async() => {
    const res = await api.get(`/docpal/cabinet/loginUser/list`).then(res => res.data.data)
    return res
}
export const GetCabinetResultApi = async(id: string) => {
    const res = await api.get(`/docpal/cabinet/${id}/loginUser/sublist`).then(res => res.data.data)
    return res
}
export const GetCabinetHeaderApi = async() => {
    const res = await api.get('/docpal/cabinet/header/list').then(res => res.data.data)
    return res
}
export const ExportCabinetApi = async(params) => {
    const res = await api.post('/docpal/cabinet/export', params, {
        responseType: 'blob',
        timeout: 0
    }).then(res => res.data)
    return res
}
