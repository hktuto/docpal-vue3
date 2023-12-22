import {api} from '../';
import { 
    pageParams, 
    paginationData,
    Response
} from '../model';
export const UpdateTemplateInfoApi = async(params) => {
    const res = await api.put('/docpal/template/document', params).then(res => res.data.data)
    return res
}

export const CreateTemplateInfoApi = async(params) => {
    const res = await api.post('/docpal/template/document', params).then(res => res.data.data)
    return res
}

export const UpdateTemplateFileApi = async(params, cb?) => {
    return api.put('/docpal/template/document/upload', params, {
        timeout:0,
        onUploadProgress: function (progressEvent) {
            if(cb) cb(progressEvent)
        }
    }).then(res => res.data.data)
}

export const GetTemplatePageApi = async(params: pageParams):Promise<paginationData> => {
    return api.post<Response<paginationData>>('/docpal/template/document/page', params ).then(res => res.data.data);
}

export const GetAllTemplatePageApi = async():Promise<paginationData> => {
    return api.get<Response<paginationData>>('/docpal/template/document/all' ).then(res => res.data.data);
}

export const GenerateFileApi = async(params, cb?) => {
    const res = await api.post('/docpal/template/document/generate/file', params, {
        timeout:0,
        responseType: 'blob',
        headers: {'white': 'true'},
        onDownloadProgress: function (progressEvent) {
            if(cb) cb(progressEvent)
        }
    }).then(res => res.data)
    return res
}
export const GetTemplateInfoApi = async(id: string) => {
    const res = await api.get(`/docpal/template/document/${id}`).then(res => res.data.data)
    return res
}

export const DeleteTemplateApi = async(id: string) => {
    const res = await api.delete(`/docpal/template/document/${id}`).then(res => res.data.data)
    return res
}
export const GetTemplateSupportTypeApi = async() => {
    const res = await api.get('/docpal/template/document/support/fileType').then(res => res.data.data)
    return res
}
export const GetTemplatePageConditionsApi = async() => {
    const res = await api.get('/docpal/template/document/page/conditions').then(res => res.data.data)
    return res
}
export const GetTemplateVariablesApi = async(id: string) => {
    const res = await api.get(`/docpal/template/document/refresh/${id}`).then(res => res.data.data)
    return res
}
