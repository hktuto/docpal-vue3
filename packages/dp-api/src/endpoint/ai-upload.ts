import {api} from '../';
export const SaveUploadFileOverviewApi = async(userId: string, filesCount: number) => {
    const res = await api.post('/nuxeo/document/saveUploadFileOverview', {
        userId,
        filesCount
    }).then(res => res.data.data)
    return res
}
export const UploadTempFolderApi = async(params: any) => {
    const res = await api.post('/nuxeo/document/uploadTempFolder', params).then(res => res.data.data)
    return res
}
export const UploadTempFileApi = async(params: any, cb) => {
    const res = await api.post('/nuxeo/document/uploadTempFile', params, {
        timeout:0,
        onUploadProgress: function (progressEvent) {
            if(cb) cb(progressEvent)
        }
    }).then(res => res.data.data)
    return res
}
export const UploadAIPageApi = async(params: any) => {
    const res = await api.post('/nuxeo/document/queryUploadFileDTOPage', params).then(res => res.data.data)
    return res
}
export const UploadAIDetailApi = async(userId: string, uploadId: string) => {
    const res = await api.post(`/nuxeo/document/queryUploadFileDetailDTOList?userId=${userId}&uploadId=${uploadId}`).then(res => res.data.data)
    return res
}
export const DeleteUploadAIApi = async(id: string) => {
    const res = await api.delete(`/nuxeo/document/tempFile/${id}`).then(res => res.data.data)
    return res
}
export const CancelUploadAIApi = async(params) => {
    const res = await api.post('/nuxeo/document/batchCancel', params).then(res => res.data.data)
    return res
}
export const ConfirmUploadAIApi = async(id: string) => {
    const res = await api.post('/nuxeo/document/batchConfirm').then(res => res.data.data)
    return res
}

