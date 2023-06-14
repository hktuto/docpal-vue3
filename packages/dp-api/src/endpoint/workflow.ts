import {api} from '../';
import {
    pageParams,
    historyProcessReq,
    workflowProps,
    workflowAttachmentInfo,
    workflowFormReq,
    workflowBpmnReq,
    workflowCommentSendReq,
    fromPropertiesReq,
    propertiesSaveReq,
    Response
} from '../model';

export const getFormPropsApi = async(params: fromPropertiesReq):Promise<workflowProps[]> => {
    return await api.post<Response<workflowProps[]>>('/docpal/workflow/properties', params).then(res => res.data.data);
}
export const workflowAttachmentInfoGetApi = async(attachmentId:string):Promise<workflowAttachmentInfo> => {
    return await api.get<Response<workflowAttachmentInfo>>(`/docpal/workflow/task/attachment/info?attachmentId=${attachmentId}`).then(res => res.data.data);
}
export const getAvailableWorkflowApi = async () => {
    return await api.post('/docpal/workflow/process/list',{}).then(res => res.data.data);
}
export const workflowFormSubmitApi = async(params: workflowFormReq) => {
    const response = await api.post('/docpal/workflow/form/submit', params).then(res => res.data.result);
    return response
}
export const getTaskApi = async(taskId:string) => {
    return await api.post('/docpal/workflow/task', { taskId }).then(res => res.data.data);
}
export const getMyTask = async(params: pageParams) =>{
    const res = await api.post('/docpal/workflow/tasks/personal', params).then(res => res.data.data);
    return { entryList: res.entryList || [], totalSize: res.totalSize }
}
export const taskClaimApi = async(taskId:string, userId:string) => {
    return await api.post('/docpal/workflow/task/claim', { taskId, userId }).then(res => res.data.data);
}
export const exportProcessHistoryApi = async(params: any) => {
    return await api.post('/docpal/workflow/history/exportProcessHistory', params, {
        responseType: 'blob',
        timeout: 0
    }).then(res => res.data);
}
export const exportTasksUserApi = async(params: any) => {
    return await api.post('/docpal/workflow/tasks/exportTasksUser', params, {
        responseType: 'blob',
        timeout: 0
    }).then(res => res.data);
}

export const taskUnClaimApi = async(taskId:string) => {
    const response = await api.post('/docpal/workflow/task/unclaim', { taskId }).then(res => res.data.data);
    return response
}
export const taskDeleteApi = async(processInstanceId:string, userId:string) => {
    const response = await api.delete('/docpal/workflow/process/deleteProcessInstanceByCreator', { params:{ processInstanceId, userId } }).then(res => res.data.data);
    return response
}

/**
 * 
 * @param candidateOrAssigned user
 * @param cassignedUser personal
 * @param interrelatedUserId active
 * @returns 
 */
export const getAllTask = async(params: pageParams) =>{
    const res = await api.post('/docpal/workflow/tasks/user', params).then(res => res.data.data);
    return { entryList: res.entryList || [], totalSize: res.totalSize }
}
export const workflowProcessStartApi = async(form: any) => {
    return await api.post('/docpal/workflow/process/start', form ).then(res => res.data.data);
}   
export const activeProcessGetApi = async(params: pageParams) => {
    const res = await api.post('/docpal/workflow/process/active', params).then(res => res.data.data);
    return { entryList: res.entryList || [], totalSize: res.totalSize }
}
export const activeProcessDetailGetApi = async(processInstanceId: string) => {
    const res = await api.post('/docpal/workflow/process/active', {processInstanceId}).then(res => res.data.data);
    return res.entryList[0] || {}
}
export const historyProcessGetApi = async(params: historyProcessReq) => {
    const res = await api.post('/docpal/workflow/history/process', params).then(res => res.data.data);
    return { entryList: res.entryList || [], totalSize: res.totalSize }
}
export const historyProcessDetailGetApi = async(params: historyProcessReq) => {
    const res = await api.post('/docpal/workflow/history/process', params).then(res => res.data.data);
    return res.entryList[0] || {}
}
export const getAdHocPageApi = async(param) => {
    const res = await api.post(`/docpal/workflow/queryAdhocApprovalPage`, param).then(res => res.data.data);
    
    return { entryList: res.entryList || [], totalSize: res.totalSize }
}
export const taskFormJsonGetApi = async(params) => {
    return await api.get('/docpal/relation/query', {params: params}).then(res => res.data.data);
}
export const propertiesSaveApi = async(params: propertiesSaveReq) => {
    return await api.post('/docpal/workflow/properties/save', params).then(res => res.data.data);
}
export const propertiesSubmitApi = async(params: propertiesSaveReq) => {
    return await api.post('/docpal/workflow/form/submit', params).then(res => res.data.result);
}
export const getActivityApi = async(processInstanceId:string) => {
    const response = await api.post('/docpal/workflow/history/activity', { processInstanceId, pageSize:-1 }).then(res => res.data.data);
    return response.list.filter(i => i.activityName).reverse()
}
export const getBpmnApi = async(params: workflowBpmnReq) => {
    return api.post('/docpal/workflow/process/model', params, {
        responseType: 'blob'
    }).then(res =>res.data)
}
export const attachmentInfoGetApi = async(attachmentId: string) => {
    const res = await api.get(`/docpal/workflow/task/attachment/info?attachmentId=${attachmentId}`).then(res => res.data.data);
    return res
}
export const WorkflowAttachmentDownloadApi = async(attachmentId: string) => {
    return api.get(`/docpal/workflow/task/attachment?attachmentId=${attachmentId}`, { responseType: 'blob', timeout: 0}).then(res => res.data)
}
export const WorkflowAttachmentPreviewApi = async(attachmentId: string) => {
    return api.get(`/docpal/workflow/task/attachment/preview?attachmentId=${attachmentId}`, { responseType: 'blob', timeout: 0}).then(res => res.data)
}
export const getProcessCommentApi = async(processInstanceId: string) => {
    return await api.get("/docpal/workflow/comment/process", { params: { processInstanceId } }).then(res => res.data.data);
}
export const sendProcessCommentsApi = async(params: workflowCommentSendReq) => {
    const response = await api.post('/docpal/workflow/comment/process', {}, {params})
    return response || []
}

export const startAdhocApi = async(params) => {
    return await api.post('/docpal/workflow/process/start', params ).then(res => res.data.data);
}

export const auditAdhocApi = async(params) => {
    return await api.post('/docpal/workflow/submitAdhocApproval', params ).then(res => res.data.data);
}
