import {api} from '../';
import { 
    pageParams, 
    paginationData,
    Response
} from '../model';
export const GetDashboardPageApi = async(params: pageParams):Promise<paginationData> => {
    // @ts-ignore
    const {externalEndpoint} = useSetting()
    console.log("externalEndpoint", externalEndpoint.value.dashboard)
    const res = await api.post<Response<paginationData>>('/docpal/user/dashboard/page', params, {
        // check host name is localhost or not, if no change base url to process.env.DASHBOARD_PROXY
        baseURL: location.hostname === 'localhost' ? '/dashboard' : externalEndpoint.value.dashboard
        // baseURL:  '/dashboard'
    }).then(res => res.data.data)
    return res
}

export const GetDashboardApi = async(id: string) => {
    // @ts-ignore
    const {externalEndpoint} = useSetting()
    const res = await api.get(`/docpal/user/dashboard/${id}`, {
        baseURL: location.hostname === 'localhost' ? '/dashboard' : externalEndpoint.value.dashboard
    }).then(res => res.data.data)
    return res
}
export const DeleteDashboardApi = async(id: string) => {
    // @ts-ignore
    const {externalEndpoint} = useSetting()
    const res = await api.delete(`/docpal/user/dashboard/${id}`, {
        baseURL: location.hostname === 'localhost' ? '/dashboard' : externalEndpoint.value.dashboard
    }).then(res => res.data.data)
    return res
}

export const CreateDashboardApi = async(params: any) => {
    // @ts-ignore
    const {externalEndpoint} = useSetting()
    const res = await api.post('/docpal/user/dashboard', params, {
        baseURL: location.hostname === 'localhost' ? '/dashboard' : externalEndpoint.value.dashboard
    }).then(res => res.data.data)
    return res
}
export const UpdateDashboardApi = async(params: any) => {
    // @ts-ignore
    const {externalEndpoint} = useSetting()
    const res = await api.put('/docpal/user/dashboard', params, {
        baseURL: location.hostname === 'localhost' ? '/dashboard' : externalEndpoint.value.dashboard
    }).then(res => res.data.data)
    return res
}

// size
export const GetDocTypeSizeApi = async(params: any = {}) => {
    // @ts-ignore
    const {externalEndpoint} = useSetting()
    const res = await api.post('/docpal/dashboard/DocumentTypeOfSizeByRange', params, {
        baseURL: location.hostname === 'localhost' ? '/dashboard' : externalEndpoint.value.dashboard
    }).then(res => res.data.data)
    return res
}
export const GetDocTypeSizeTrendApi = async(params: any= {}) => {
    // @ts-ignore
    const {externalEndpoint} = useSetting()
    const res = await api.post('/docpal/dashboard/DocumentTypeOfSizeByMonthlyRangeCumulation', params, {
        baseURL: location.hostname === 'localhost' ? '/dashboard' : externalEndpoint.value.dashboard
    }).then(res => res.data.data)
    return res
}
// count
export const GetDocTypeCountApi = async(params: any = {}) => {
    // @ts-ignore
    const {externalEndpoint} = useSetting()
    const res = await api.post('/docpal/dashboard/DocumentTypeOfCountByRange', params, {
        baseURL: location.hostname === 'localhost' ? '/dashboard' : externalEndpoint.value.dashboard
    }).then(res => res.data.data)
    return res
}
// co-count count
export const GetCoCountCountApi = async(primaryType: string, creator?: string) => {
    // @ts-ignore
    const {externalEndpoint} = useSetting()
    if(creator) return await GeCoCountCountSingleUserApi({
        primaryType,
        creator
    })
    const res = await api.post('/docpal/dashboard/NewFilesOfUsersCountByDTypeBymonthlyCumulation', {primaryType}, {
        baseURL: location.hostname === 'localhost' ? '/dashboard' : externalEndpoint.value.dashboard
    }).then(res => res.data.data)
    return res
}
export const GeCoCountCountSingleUserApi = async(params: any) => {
    // @ts-ignore
    const {externalEndpoint} = useSetting()
    const res = await api.post('/docpal/dashboard/NewFilesOfSpecifyUserCountByDTypeBymonthlyCumulation', params, {
        baseURL: location.hostname === 'localhost' ? '/dashboard' : externalEndpoint.value.dashboard
    }).then(res => res.data.data)
    return res
}
// co-count size
export const GetCoCountSizeApi = async(primaryType: string, creator?: string) => {
    // @ts-ignore
    const {externalEndpoint} = useSetting()
    if (creator) {
        return await GeCoCountSizeSingleUserApi({
            primaryType,
            creator
        })
    }
    const res = await api.post('/docpal/dashboard/NewFilesOfUsersSizeByDTypeBymonthlyCumulation', {primaryType}, {
        baseURL: location.hostname === 'localhost' ? '/dashboard' : externalEndpoint.value.dashboard
    }).then(res => res.data.data)
    return res
}
export const GeCoCountSizeSingleUserApi = async(params: any) => {
    // @ts-ignore
    const {externalEndpoint} = useSetting()
    const res = await api.post('/docpal/dashboard/NewFilesOfSpecifyUserSizeByDTypeBymonthlyCumulation', params, {
        baseURL: location.hostname === 'localhost' ? '/dashboard' : externalEndpoint.value.dashboard
    }).then(res => res.data.data)
    return res
}
// co-count meta
export const GetCoCountMetaApi = async(params: any) => {
    // @ts-ignore
    const {externalEndpoint} = useSetting()
    if (params.creator) return await GeCoCountMetaSingleUserApi(params)
    const res = await api.post('/docpal/dashboard/NewFilesOfUsersMetaByDTypeByRange', params, {
        baseURL: location.hostname === 'localhost' ? '/dashboard' : externalEndpoint.value.dashboard
    }).then(res => res.data.data)
    return res
}
export const GeCoCountMetaSingleUserApi = async(params: any) => {
    // @ts-ignore
    const {externalEndpoint} = useSetting()
    const res = await api.post('/docpal/dashboard/NewFilesOfSpecifyUserMetaByDTypeByRange', params, {
        baseURL: location.hostname === 'localhost' ? '/dashboard' : externalEndpoint.value.dashboard
    }).then(res => res.data.data)
    return res
}

// co-count meta filter
export const GetCoCountMetaFilterApi = async(params: any) => {
    // @ts-ignore
    const {externalEndpoint} = useSetting()
    if (params.creator) return await GeCoCountMetaFilterSingleUserApi(params)
    const res = await api.post('/docpal/dashboard/NewFilesOfUserByDTypeByRangeFilterMatedata', params, {
        baseURL: location.hostname === 'localhost' ? '/dashboard' : externalEndpoint.value.dashboard
    }).then(res => res.data.data)
    return res
}
export const GeCoCountMetaFilterSingleUserApi = async(params: any) => {
    // @ts-ignore
    const {externalEndpoint} = useSetting()
    const res = await api.post('/docpal/dashboard/NewFilesOfSpecifyUserByDTypeByRangeFilterMatedata', params, {
        baseURL: location.hostname === 'localhost' ? '/dashboard' : externalEndpoint.value.dashboard
    }).then(res => res.data.data)
    return res
}


