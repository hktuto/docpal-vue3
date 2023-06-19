import { api } from '../';
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
    const res = await api.delete(`docpal/cabinet/${id}`).then(res => res.data.data)
    return res
}
