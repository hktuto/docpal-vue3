import { api } from '../';
import {
    pageParams,
    paginationData,
} from '../model';
export const CreateInternalShareApi = async (params) => {
    const res = await api.post('/docpal/internalShare', params).then(res => res.data.data)
    return res
}

export const GetShareMeApi = async(params: pageParams) => {
    const res = await api.post('docpal/internalShare/me', params).then(res => res.data.data)
    return {
        entryList: res.entryList,
        totalSize: res.totalSize
    }
}
export const DeleteShareMeApi = async(ids: string []) => {
    const res = await api.delete('/docpal/internalShare/me', {data: ids }).then(res => res.data.data)
    return res
}

export const GetShareOthersApi = async(params: pageParams) => {
    const res = await api.post('docpal/internalShare/others', params).then(res => res.data.data)
    return {
        entryList: res.entryList,
        totalSize: res.totalSize
    }
}
export const DeleteShareApi = async(ids: string []) => {
    const res = await api.delete('/docpal/internalShare', { data: ids }).then(res => res.data.data)
    return res
}