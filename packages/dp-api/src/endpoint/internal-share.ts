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
    const res = await api.post('/docpal/internalShare/me', params).then(res => res.data.data)
    return {
        entryList: res.entryList,
        totalSize: res.totalSize
    }
}
export const DeleteShareMeApi = async(ids: string []) => {
    const res = await api.delete('/docpal/internalShare/me', {data: {detailIds: ids} }).then(res => res.data.data)
    return res
}

export const GetShareOthersApi = async(params: pageParams) => {
    const res = await api.post('/docpal/internalShare/others', params).then(res => res.data.data)
    return {
        entryList: res.entryList,
        totalSize: res.totalSize
    }
}
export const DeleteShareApi = async(detailIds: string []) => {
    const res = await api.delete('/docpal/internalShare', {data: {detailIds} }).then(res => res.data.data)
    return res
}

// #region module: admin
    export const GetShareInternalApi = async(params: pageParams) => {
        const res = await api.post('/docpal/internalShare/page', params).then(res => res.data.data)
        return {
            entryList: res.entryList,
            totalSize: res.totalSize
        }
    }
// #endregion
