import {api} from '../';
import {
    pageParams,
    historyProcessReq,
    workflowProps,
    workflowAttachmentInfo,
    workflowFormReq,
    workflowBpmnReq,
    workflowCommentSendReq,
    fromPropertiesReq
} from '../model';

export const getFormPropsApi = async(params: fromPropertiesReq):Promise<workflowProps[]> => {
    return await api.post<workflowProps[]>('/docpal/workflow/properties', params).then(res => res.data);
}
export const workflowAttachmentInfoGetApi = async(attachmentId:string):Promise<workflowAttachmentInfo> => {
    return await api.get<workflowAttachmentInfo>(`/docpal/workflow/task/attachment/info?attachmentId=${attachmentId}`).then(res => res.data);
}
export const getAvailableWorkflowApi = async () => {
    return await api.post('/docpal/workflow/process/list',{}).then(res => res.data);
}
export const workflowFormSubmitApi = async(params: workflowFormReq) => {
    const response = await api.post('/docpal/workflow/form/submit', params).then(res => res.data);
    return response || true
}
export const getTaskApi = async(taskId:string) => {
    return await api.post('/docpal/workflow/task', { taskId }).then(res => res.data);
}
export const workflowProcessStartApi = async(form: any) => {
    return await api.post('/docpal/workflow/process/start', form ).then(res => res.data);
}   
export const activeProcessGetApi = async(params: pageParams) => {
    const res = await api.post('/docpal/workflow/process/active', params).then(res => res.data);
    return { entryList: res.entryList || [], totalSize: res.totalSize }
}
export const activeProcessDetailGetApi = async(processInstanceId: string) => {
    const res = await api.post('/docpal/workflow/process/active', {processInstanceId}).then(res => res.data);
    return res.entryList[0] || {}
}
export const historyProcessGetApi = async(params: historyProcessReq) => {
    const res = await api.post('/docpal/workflow/history/process', params).then(res => res.data);
    return { entryList: res.entryList || [], totalSize: res.totalSize }
}
export const historyProcessDetailGetApi = async(params: historyProcessReq) => {
    const res = await api.post('/docpal/workflow/history/process', params).then(res => res.data);
    return res.entryList[0] || {}
}
export const getAdHocPageApi = async(param) => {
    const res = await api.post(`/docpal/workflow/queryAdhocApprovalPage`, param).then(res => res.data.data);
    
    return { entryList: res.entryList || [], totalSize: res.totalSize }
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
