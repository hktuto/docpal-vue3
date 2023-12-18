import {api} from '../';
import { 
    pageParams,
    paginationData,
} from '../model';
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
export const UploadAIPageApi = async(params: pageParams): Promise<paginationData> => {
    const res = await api.post('/nuxeo/document/queryUploadFileDTOPage', params).then(res => res.data.data)
    return {
        entryList: res.content,
        totalSize: res.totalElements
    }
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
export const ConfirmUploadAIApi = async(params: any) => {
    const res = await api.post('/nuxeo/document/batchConfirm', params).then(res => res.data.data)
    return res
}
export const UploadAiDocumentApi = async(params: any) => {
    const res = await api.patch('/nuxeo/document/UploadAiDocument', params).then(res => res.data.data)
    return res
}

export const ReplaceFileAiDocumentApi = async(params: any) => {
    const res = await api.patch('/nuxeo/document/replaceFile/v2', params).then(res => res.data.data)
    return res
}
export const GetDocumentAiAnalyzeApi = async(docId: string, needDocType: boolean = false) => {
    try {
        const res = await api.get(`/nuxeo/document/queryAiAnalyze/${docId}`, {
            headers: { 'noThrowError' : "true" }
        }).then(res => res.data.data)
        const metaDatas = res.metaDatas.reduce((prev: any, item) => {
            if(item.label || item.value) {
                prev[item.name] = {}
                if(item.label) prev[item.name].label = item.label
                if(item.value) prev[item.name].value = item.value
            }
            return prev
        }, {})
        if(needDocType && res.documentType) metaDatas.documentType = {
            value: res.documentType
        }
        return metaDatas
    } catch (error) {
        return {}
    }
}
