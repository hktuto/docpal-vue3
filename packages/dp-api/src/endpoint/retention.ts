import { api } from '../';
import {
    pageParams,
    paginationData,
    Response
} from '../model';
export type Retention = {
    id?: string,
    policyName: string,
    isAuto: boolean,
    approvalId: string,
    status?: string,
    periodNum?: number,
    periodUnit?: string,
    actionType?: string,
    actionDelayDay?: number,
    triggers?: RetentionTrigger[],
    events?: RetentionEvents[]
}
export type RetentionTrigger = {
    policyRetentionId?: string,
    documentType: string,
    triggerMetaData: string
}
export type RetentionEvents = {
    eventType: string,
    eventLabel: string,
    eventValue?: number
}
export const GetRetentionPageApi = async(params: pageParams):Promise<paginationData> => {
    return await api.post<Response<paginationData>>('/docpal/policy/retentions/page', params ).then(res => res.data.data);
}

export const UpdateRetentionApi = async(params: Retention) => {
    return await api.put('/docpal/policy/retentions', params ).then(res => res.data.data);
}

export const CreateRetentionApi = async(params: Retention) => {
    return await api.post('/docpal/policy/retentions', params ).then(res => res.data.data);
}

export const UpdateRetentionStatusApi = async(id: string, status: string) => {
    return await api.patch(`/docpal/policy/retentions/${id}/status/${status}` ).then(res => res.data.data);
}

export const GetRetentionDetailApi = async(id: string) => {
    return await api.get(`/docpal/policy/retentions/${id}`).then(res => res.data.data);
}
export const DeleteRetentionApi = async(id: string) => {
    return await api.delete(`/docpal/policy/retentions/${id}`).then(res => res.data.data);
}
export const GetRetentionConditionsApi = async() => {
    return await api.get('/docpal/policy/retentions/page/conditions').then(res => res.data.data);
}
export const CheckDocumentTypeUsedApi = async(documentType: string) => {
    return await api.get('/docpal/policy/retentions/documentType/used').then(res => res.data.data);
}