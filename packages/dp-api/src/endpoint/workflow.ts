import {api} from '../';
import {
    pageParams,
    historyProcessReq,
    workflowProps,
    workflowAttachmentInfo,
    workflowFormReq,
    workflowBpmnReq,
    workflowCommentSendReq
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
export const historyProcessGetApi = async(params: historyProcessReq) => {
    const res = await api.post('/docpal/workflow/history/process', params).then(res => res.data);
    return { entryList: res.list, totalSize: res.count }
}
export const historyProcessDetailGetApi = async(params: historyProcessReq) => {
    const res = await api.post('/docpal/workflow/history/process', params).then(res => res.data);
    return res.list[0] || {}
}
export const taskFormJsonGetApi = async(params) => {
    return await api.get('/docpal/relation/query', {params: params}).then(res => res.data);
}
export const getActivityApi = async(processInstanceId:string) => {
    const response = await api.post('/docpal/workflow/history/activity', { processInstanceId, pageSize:-1 }).then(res => res.data);
    return response.list.filter(i => i.activityName).reverse()
}
export const getBpmnApi = async(params: workflowBpmnReq) => {
    return api.post('/docpal/workflow/process/model', params, {
        responseType: 'blob'
    }).then(res =>res.data)
}
export const attachmentInfoGetApi = async(attachmentId: string) => {
    const res = await api.get(`/docpal/workflow/task/attachment/info?attachmentId=${attachmentId}`).then(res => res.data);
    return res
}

export const getProcessCommentApi = async(processInstanceId: string) => {
    return await api.get("/docpal/workflow/comment/process", { params: { processInstanceId } }).then(res => res.data);
}
export const sendProcessCommentsApi = async(params: workflowCommentSendReq) => {
    const response = await api.post('/docpal/workflow/comment/process', {}, {params})
    return response || []
}
