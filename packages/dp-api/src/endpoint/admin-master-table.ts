import {api} from '..';

export const SaveMasterTablesApi = async(params) => {
    const res = await api.post('/docpal/master/tables', params).then(res => res.data.data)
    return res
}
export const SaveMasterTablesRecordApi = async() => {
    const res = await api.post('/docpal/master/tables/record').then(res => res.data.data)
    return res
}

// export const DeleteMasterTablesRecordApi = async() => {
//     const res = await api.('/docpal/master/tables/record/delete').then(res => res.data.data)
//     return res
// }

export const GetMasterTablesPageApi = async(params) => {
    const res = await api.post('/docpal/master/tables/page', params).then(res => res.data.data)
    return res
}

export const GetMasterTablesDetailApi = async(id: string) => {
    const res = await api.get(`/docpal/master/tables/${id}`).then(res => res.data.data)
    return res
}

export const GetMasterTablesPageConditionApi = async() => {
    const res = await api.get('/docpal/master/tables/page/conditions').then(res => res.data.data)
    return res
}

export const DeleteMasterTablesApi = async(masterTableId: string) => {
    const res = await api.delete(`/docpal/master/tables/${masterTableId}`).then(res => res.data.data)
    return res
}

export const DeleteMasterTablesRecordApi = async(tableId: string, recordId: string) => {
    const res = await api.delete(`/api/docpal/master/tables/record/${tableId}/${recordId}`).then(res => res.data.data)
    return res
}

