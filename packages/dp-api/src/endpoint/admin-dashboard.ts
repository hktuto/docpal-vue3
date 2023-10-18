import {api} from '../';
import { 
    pageParams, 
    paginationData,
    Response
} from '../model';
export const GetDashboardPageApi = async(params: pageParams):Promise<paginationData> => {
    const res = await api.post<Response<paginationData>>('/docpal/user/dashboard/page', params, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}

export const GetDashboardApi = async(id: string) => {
    const res = await api.get(`/docpal/user/dashboard/${id}`, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}
export const DeleteDashboardApi = async(id: string) => {
    const res = await api.delete(`/docpal/user/dashboard/${id}`, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}

export const CreateDashboardApi = async(params: any) => {
    const res = await api.post('/docpal/user/dashboard', params, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}
export const UpdateDashboardApi = async(params: any) => {
    const res = await api.put('/docpal/user/dashboard', params, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}

// size1
export const GetDocumentTypeOfSizeByRangeApi = async(timeFlag: string, queryList: boolean = true) => {
    const res = await api.post('/docpal/dashboard/DocumentTypeOfSizeByRange', {
        timeFlag,
        queryList
    }, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}
export const QueryDocumentTypeCountApi = async(params: any) => {
    const res = await api.post('/api/docpal/dashboard/queryDocumentTypeCount', params, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}
