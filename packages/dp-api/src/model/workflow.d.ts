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
