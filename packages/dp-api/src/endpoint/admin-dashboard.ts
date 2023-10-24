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
export const GetDocTypeSizeTrendApi = async(params: any= {}) => {
    const res = await api.post('/docpal/dashboard/DocumentTypeOfSizeByMonthlyRangeCumulation', params, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}
// count
export const GetDocTypeCountApi = async(params: any = {}) => {
    const res = await api.post('/docpal/dashboard/DocumentTypeOfCountByRange', params, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}
// co-count count
export const GetCoCountCountApi = async(primaryType: string, creator?: string) => {
    if(creator) return await GeCoCountCountSingleUserApi({
        primaryType,
        creator
    })
    const res = await api.post('/docpal/dashboard/NewFilesOfUsersCountByDTypeBymonthlyCumulation', {primaryType}, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}
export const GeCoCountCountSingleUserApi = async(params: any) => {
    const res = await api.post('/docpal/dashboard/NewFilesOfSpecifyUserCountByDTypeBymonthlyCumulation', params, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}
// co-count size
export const GetCoCountSizeApi = async(primaryType: string, creator?: string) => {
    if (creator) {
        return await GeCoCountSizeSingleUserApi({
            primaryType,
            creator
        })
    }
    const res = await api.post('/docpal/dashboard/NewFilesOfUsersSizeByDTypeBymonthlyCumulation', {primaryType}, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}
export const GeCoCountSizeSingleUserApi = async(params: any) => {
    const res = await api.post('/docpal/dashboard/NewFilesOfSpecifyUserSizeByDTypeBymonthlyCumulation', params, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}
// co-count meta
export const GetCoCountMetaApi = async(params: any) => {
    if (params.creator) return await GeCoCountMetaSingleUserApi(params)
    const res = await api.post('/docpal/dashboard/NewFilesOfUsersMetaByDTypeByRange', params, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}
export const GeCoCountMetaSingleUserApi = async(params: any) => {
    const res = await api.post('/docpal/dashboard/NewFilesOfSpecifyUserMetaByDTypeByRange', params, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}

// co-count meta filter
export const GetCoCountMetaFilterApi = async(params: any) => {
    if (params.creator) return await GeCoCountMetaFilterSingleUserApi(params)
    const res = await api.post('/docpal/dashboard/NewFilesOfUserByDTypeByRangeFilterMatedata', params, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}
export const GeCoCountMetaFilterSingleUserApi = async(params: any) => {
    const res = await api.post('/docpal/dashboard/NewFilesOfSpecifyUserByDTypeByRangeFilterMatedata', params, {
        baseURL: '/dashboard'
    }).then(res => res.data.data)
    return res
}


