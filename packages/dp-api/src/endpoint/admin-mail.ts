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

