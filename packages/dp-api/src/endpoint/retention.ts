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

export const GetRetentionDocPageApi = async(params: pageParams):Promise<paginationData> => {
    // const retentionData = {
    //     "id": 0,
    //     "policyRetentionId": '123456',
    //     "documentId": "10bf27ad-c1fa-4fbc-af19-7f0880ca9a04",
    //     "documentName": "20238月1416-09-43.png",
    //     "documentPath": "/default-domain/0818/20238月1416-09-43.png",
    //     "status": "string",
    //     "createdDate": "2023-08-23T05:42:48.404Z",
    //     "modifiedDate": "2023-08-23T05:42:48.404Z",
    //     "policyName": "string",
    //     "approver": "string"
    // }
    const res = await api.post<Response<paginationData>>('/docpal/policy/retentions/document/page', params ).then(res => res.data.data);
    // res.entryList.push(retentionData)
    return res
}
export const GetRetentionDocConditionsApi = async() => {
    return await api.get('/docpal/policy/retentions/document/page/conditions').then(res => res.data.data);
}
export const GetRetentionEventsApi = async() => {
    return await api.get('/docpal/policy/retentions/events').then(res => res.data.data);
    // return {
    //     '123456': [
    //         { "id": 86766, "policyRetentionId": 86759, "eventType": "extent", "eventLabel": "extent 1d", "eventValue": "1", "createdDate": "2023-08-23T03:16:49Z", "modifiedDate": "2023-08-23T03:16:49Z" },
    //         { "id": 86767, "policyRetentionId": 86759, "eventType": "now", "eventLabel": "now", "createdDate": "2023-08-23T03:16:49Z", "modifiedDate": "2023-08-23T03:16:49Z" }
    //     ]
    // }
}
export const SubmitRetentionEventApi = async(params) => {
    return await api.post('/docpal/policy/retentions/submitEvent', params).then(res => res.data.data);
    // return true
}

export const AuditRetentionApi = async(id: string, status: boolean) => {
    return await api.patch(`/docpal/policy/retentions/${id}/approval/${status}`).then(res => res.data.data);
}
export const RefreshRetentionDocApi = async() => {
    return await api.get('/docpal/policy/retentions/scan/document').then(res => res.data.data);
}

