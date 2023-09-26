import {api} from '../';
import {
    Response,
    pageParams,
    paginationData
} from '../model';
export const GetWorkflowDraftPageApi = async(params: pageParams) => {
    return api.post('/docpal/workflow/process/definition/draft/page', params).then(res => res.data.data);
}
export const UploadWorkflowApi = async(params) => {
    return api.post('/docpal/workflow/process/definition/upload', params).then(res => res.data.data);
}
export const GetWorkflowDraftDetailApi = async(draftId: string) => {
    return api.get(`/docpal/workflow/process/definition/draft/${draftId}`).then(res => res.data.data);
}
export const GetWorkflowDraftXMLApi = async(draftId: string) => {
    return api.get(`/docpal/workflow/process/definition/draft/${draftId}/download/xml`,{
        responseType: 'blob',
        timeout: 0
    }).then(res => res.data);
}
export const ValidateWorkflowXMLApi = async(file) => {
    return api.post('/docpal/workflow/process/definition/validation', file).then(res => res.data.data);
}