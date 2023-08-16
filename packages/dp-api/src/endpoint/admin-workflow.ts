import {api} from '../';
// import { getJsonApi } from '../json';
export type GetTaskFormJsonParams = {
    processKey: string,
    userTaskId: string
}
export type GetTaskFormJsonRes = {
    id?: string,
    jsonValue?: string,
    processKey?: string,
    userTaskId?: string,
    json?: object
}
let workflowList = null
export const GetProcessDefinitionListApi = async() => {
    try {
        if(workflowList && workflowList.length > 0) return workflowList
        const res = await api.get('/docpal/workflow/process/getProcessDefinitionList').then(res => res.data)
        res.data.forEach(item => {
            item.userTasks.push({ id:'complete', name: 'complete' })
        })
        workflowList = res.data
        return res.data
    } catch (error) {
        return []
    }
}
export const GetWorkflowApi = async(processDefinitionKey: string) => {
    await GetProcessDefinitionListApi()
    const workflowDetail = workflowList.find(item => item.key === processDefinitionKey)
    return workflowDetail
}
export const GetTaskFormJsonApi = async(param: GetTaskFormJsonParams):Promise<GetTaskFormJsonRes> => {
    try {
        const res = await api.get('/docpal/relation/query', { params: param }).then(res => res.data.data)
        return {
            id: res[0].id,
            json: JSON.parse(res[0].jsonValue),
            processKey: res[0].processKey,
            userTaskId: res[0].userTaskId
        }
    } catch (error) {
        return ({})
    }
}
export const SaveTaskFormJsonApi = async(param: GetTaskFormJsonRes):Promise<GetTaskFormJsonRes> => {
    const res = await api.post('/docpal/relation/save', param).then(res => res.data.result)
    return res
}

export const DeleteWorkflowProcessApi = async(params) => {
    const res = await api.delete('/docpal/workflow/process', {params}).then(res => res.data.data)
    return res
}
