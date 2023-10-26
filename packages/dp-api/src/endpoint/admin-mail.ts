import {api} from '../';

export const GetMailConfigApi = async() => {
    const res = await api.get(`/docpal/oauth2/setting`).then(res => res.data.data)
    return res
}

export const SaveMailConfigApi = async(params) => {
    const res = await api.post(`/docpal/oauth2/setting`, params).then(res => res.data.data)
    return res
}

export const SaveMailConfigCodeApi = async(params) => {
    const res = await api.post(`/docpal/oauth2/code`, params).then(res => res.data.data)
    return res
}
// #region module: editor
    export const CreateEmailTemplateApi = async(params) => {
        const res = await api.post('/docpal/template/email/template', params).then(res => res.data.data)
        return res
    }
    export const UpdateEmailTemplateApi = async(params) => {
        const res = await api.put('/docpal/template/email/template', params).then(res => res.data.data)
        return res
    }
    export const GetEmailTemplatePageApi = async(params) => {
        const res = await api.post('/docpal/template/email/template/page', params).then(res => res.data.data)
        return res
    }
    export const DeleteEmailTemplateApi = async(id) => {
        const res = await api.delete(`/docpal/template/email/template/${id}`).then(res => res.data.data)
        return res
    }

    export const UpdateEmailLayoutApi = async(params) => {
        const res = await api.put('/docpal/template/email/layout', params).then(res => res.data.data)
        return res
    }
    export const CreateEmailLayoutApi = async(params) => {
        const res = await api.post('/docpal/template/email/layout', params).then(res => res.data.data)
        return res
    }
    export const GetEmailLayoutPageApi = async(params) => {
        const res = await api.post('/docpal/template/email/layout/page', params).then(res => res.data.data)
        return res
    }
    
    export const DeleteEmailLayoutApi = async(id) => {
        const res = await api.delete(`/docpal/template/email/layout/${id}`).then(res => res.data.data)
        return res
    }
    export const GetEmailLayoutApi = async(id) => {
        const res = await api.post(`/docpal/template/email/layout/${id}`).then(res => res.data.data)
        return res
    }
    export const GetEmailLayoutAllApi = async(id) => {
        const res = await api.get('/docpal/template/email/layout/all').then(res => res.data.data)
        return res
    }
    
// #endregion
