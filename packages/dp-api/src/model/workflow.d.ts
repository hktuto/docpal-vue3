import { pageParams } from './index'
export type workflowProps = {
    id: string,
    name: string,
    options: any,
    readable: boolean,
    required: boolean,
    time: string,
    type: string,
    value: string,
    writable: boolean
}
export type workflowAttachmentInfo = {
    content: any,
    contentId: string,
    mimeType: string,
    name: string,
    size: number,
    status: any
}
export type workflowFormReq = {
    taskId: string,
    properties: workflowFormProperties
}
export type workflowFormProperties = {
    approved: string,
}
export type fromPropertiesReq = {
    processKey?: string,
    taskId?:  string,
}
export type workflowBpmnReq = {
    processKey?: string,
    processDefinitionId?:  string,
}
export type workflowCommentSendReq = {
    processInstanceId: string,
    userId: string,
    text: string,
}
export type historyProcessReq = {
    processInstanceId?: string,
    completed?: boolean,
    userId?: string,
}&pageParams
