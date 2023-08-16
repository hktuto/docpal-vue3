import { api } from '../';
import {
    pageParams,
    paginationData,
    Response
} from '../model';
export type HoldPolicy = {
    id?: string,
    policyName: string,
    isHoldAuto: boolean,
    isHoldReasonReq: boolean,
    holdApprovalId: string,
    isRemoveAuto: boolean,
    isRemoveReasonReq: boolean,
    removeApprovalId: string,
    status?: string
}
export type AddHold = {
    documentId: string,
    holdPolicyId: string,
    applyReason: string
}
export type DeleteHold = {
    id: string,
    removeReason: string
}
export const GetHoldPoliciesPageApi = async(params: pageParams):Promise<paginationData> => {
    return await api.post<Response<paginationData>>('/docpal/policy/holds/page', params ).then(res => res.data.data);
}

export const UpdateHoldPolicyApi = async(params: HoldPolicy) => {
    return await api.put('/docpal/policy/holds', params ).then(res => res.data.data);
}

export const CreateHoldPolicyApi = async(params: HoldPolicy) => {
    return await api.post('/docpal/policy/holds', params ).then(res => res.data.data);
}

export const UpdateHoldPolicyStatusApi = async(id: string, status: string) => {
    return await api.patch(`/docpal/policy/holds/${id}/status/${status}` ).then(res => res.data.data);
}

export const GetHoldPolicyDetailApi = async(id: string) => {
    return await api.get(`/docpal/policy/holds/${id}`).then(res => res.data.data);
}
export const DeleteHoldPolicyApi = async(id: string) => {
    return await api.delete(`/docpal/policy/holds/${id}`).then(res => res.data.data);
}

// export const GetActivePoliciesApi = async() => {
//     return api.delete('/docpal/policy/documents/policies').then(res => res.data.data);
// }
export const GetHoldPoliciesApi = async() => {
    return await api.get('/docpal/policy/holds').then(res => res.data.data);
}
export const GetHoldsPageApi = async(params: pageParams):Promise<paginationData> => {
    return await api.post<Response<paginationData>>('/docpal/policy/documents/page', params).then(res => res.data.data);
}
export const AddHoldApi = async(params: AddHold) => {
    return await api.post('/docpal/policy/documents/add', params).then(res => res.data.data);
}
export const DeleteHoldApi = async(params: DeleteHold) => {
    return await api.post('/docpal/policy/documents/remove', params).then(res => res.data.data);
}
export const GetDocumentHoldApi = async(documentId: string) => {
    return await api.get(`/docpal/policy/documents/document/${documentId}`).then(res => res.data.data);
}
export const SetDocumentHoldApi = async(documentId: string, status: 'A' | 'D' | 'R') => {
    return await api.patch(`/docpal/policy/documents/${documentId}/status/${status}`).then(res => res.data.data);
}
export const GetHoldConditionsApi = async() => {
    return await api.get('/docpal/policy/documents/page/conditions').then(res => res.data.data);
}
