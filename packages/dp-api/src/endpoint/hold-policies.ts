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
export const GetHoldPoliciesApi = async(params: pageParams):Promise<paginationData> => {
    return api.post<Response<paginationData>>('/docpal/policy/holds/page', params ).then(res => res.data.data);
}

export const UpdateHoldPolicyApi = async(params: HoldPolicy) => {
    return api.put('/docpal/policy/holds', params ).then(res => res.data.data);
}

export const CreateHoldPolicyApi = async(params: HoldPolicy) => {
    return api.post('/docpal/policy/holds', params ).then(res => res.data.data);
}

export const UpdateHoldPolicyStatusApi = async(id: string, status: string) => {
    return api.patch(`/docpal/policy/holds/${id}/status/${status}` ).then(res => res.data.data);
}

export const GetHoldPolicyDetailApi = async(id: string) => {
    return api.get(`/docpal/policy/holds/${id}`).then(res => res.data.data);
}
export const DeleteHoldPolicyApi = async(id: string) => {
    return api.delete(`/docpal/policy/holds/${id}`).then(res => res.data.data);
}