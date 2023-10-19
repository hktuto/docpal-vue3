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

// size
export const GetDocTypeSizeApi = async(params: any = {}) => {
    const res = await api.post('/docpal/dashboard/DocumentTypeOfSizeByRange', params, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}
// size trend
export const GetDocTypeSizeTrendApi = async(params: any= {}) => {
    const res = await api.post('/docpal/dashboard/DocumentTypeOfSizeByMonthlyRangeCumulation', params, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}
// count
export const GetDocTypeCountApi = async(params: any) => {
    const res = await api.post('/docpal/dashboard/DocumentTypeOfCountByRange', params, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}

