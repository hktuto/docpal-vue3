import {api} from '../';
import {
    pageParams,
    workflowProps,
    workflowAttachmentInfo,
    workflowFormReq
} from '../model';

export const getFormPropsApi = async(taskId:string):Promise<workflowProps[]> => {
    return await api.post<workflowProps[]>('/docpal/workflow/properties',{ taskId }).then(res => res.data);
}
export const workflowAttachmentInfoGetApi = async(attachmentId:string):Promise<workflowAttachmentInfo> => {
    return await api.get<workflowAttachmentInfo>(`/docpal/workflow/task/attachment/info?attachmentId=${attachmentId}`).then(res => res.data);
}

export const workflowFormSubmitApi = async(params: workflowFormReq) => {
    const response = await api.post('/docpal/workflow/form/submit', params).then(res => res.data);
    return response || true
}

