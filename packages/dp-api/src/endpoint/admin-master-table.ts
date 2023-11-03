import {api} from '..';
// table
export const SaveMasterTablesApi = async(params) => {
    const res = await api.post('/docpal/master/tables', params).then(res => res.data.data)
    return res
}
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

// Record
export const GetMasterTablesRecordPageApi = async(params) => {
    const res = await api.post('/docpal/master/tables/record/page', params).then(res => res.data.data)
    return res
}

export const CreateMasterTablesRecordApi = async(params) => {
    const res = await api.post('/docpal/master/tables/record', params).then(res => res.data.data)
    return res
}
export const UpdateMasterTablesRecordApi = async(params) => {
    const res = await api.put(`/docpal/master/tables/${params.id}/record`, params).then(res => res.data.data)
    return res
}

export const DeleteMasterTablesRecordApi = async(tableId: string, recordId: string) => {
    const res = await api.delete(`/docpal/master/tables/${tableId}/record?recordId=${recordId}`).then(res => res.data.data)
    return res
}

