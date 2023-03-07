import {api} from '../';
import { BreadResponse, DocDetail, GetChildResponse, pageParams } from '../model';

export const GetChildThumbnail = async(idOrPath: string):Promise<GetChildResponse> => {
    return api.post<GetChildResponse>('/nuxeo/document/children/thumbnail',{ idOrPath }).then(res => res.data);
}

export const GetDocDetail = async(idOrPath:string):Promise<DocDetail> => {
    return api.post<DocDetail>('/nuxeo/document',{ idOrPath }).then(res => res.data);
}

export const GetBreadcrumb = async(idOrPath:string):Promise<BreadResponse> => {
    return api.post<BreadResponse>('/nuxeo/document/breadcrumb', { idOrPath }).then(res => res.data);
}

export const GetChild = async(idOrPath:string):Promise<GetChildResponse> => {
    return api.post<GetChildResponse>('/nuxeo/document/children', { idOrPath }).then(res => res.data);
}

export const GetDocumentPreview = async(idOrPath:string) => {
    return api.post('/nuxeo/document/preview', {
        idOrPath
    },{
        responseType: 'blob'
    }).then(res =>res.data)
}

export const GetAnnotation = async(idOrPath:string) => {
    return api.get('/nuxeo/annotation', {params:{
        idOrPath
    }})
}

// #region module: trash
    export const GetTrashApi = async(params: pageParams) => {
        const { entryList, totalSize }:any = await api.get('/nuxeo/document/trash',{ params }).then(res => res.data)
        return { entryList, totalSize }
    }

    export const DeleteByIdApi = async (idOrPath: string) => {
        return await api.delete('/nuxeo/document', { data:{idOrPath} }).then(() => true)
    }
    export const RestoreByIdApi = async (idOrPath: string) => {
        return await api.post('/nuxeo/document/restore', { idOrPath }).then(() => true)
    }
// #endregion

// #region module: collection
    export const getCollectionApi = async (params: pageParams) => {
        const { entryList, totalSize } = await api.get('/nuxeo/collection', { params }).then(res =>res.data);
        return {entryList, totalSize}
    }
    export const removeCollectionApi = async (idOrPath: string) => {
        return await api.delete('/nuxeo/collection/remove', { data: {idOrPath} }).then(res =>res.data);
    }
    export const getCollectionDocApi = async (idOrPath: string) => {
        return await api.delete('/nuxeo/collection/remove', { data: {idOrPath} }).then(res =>res.data);
    }
    export const getCollectionDoc = async (idOrPath: string) => {
        const { entryList, totalSize } = await api.post('/nuxeo/collection/documents', { idOrPath }).then(res =>res.data);
        return {entryList, totalSize}
    }
// #endregion
