import {api} from '../';
import { getPreviewParams } from '../model';
export const getPublicDocumentApi = async(params: getPreviewParams) => {
    return api.get('/nuxeo/public/document', { params }).then(res => res.data)
}
export const getPreviewApi = async(params: getPreviewParams) => {
    return api.get(`/nuxeo/public/share/preview?token=${params.token}&password=${params.password}&documentId=${params.documentId}`, { responseType: 'blob', timeout: 0 }).then(res => res.data)
}
export const publicDownloadApi = async(params: getPreviewParams) => {
    return api.get(`/nuxeo/public/share/download?token=${params.token}&password=${params.password}&documentId=${params.documentId}`, { responseType: 'blob', timeout: 0 }).then(res => res.data)
}
