import {api} from '../';
import { BreadResponse, DocDetail, GetChildResponse, 
    pageParams, collectionRemoveDocParams, collectionCreateParams,
    shareInfo,
    DocType,
    Meta,
    paginationData,
    idOrPathParams,
    Response
} from '../model';

export const GetChildThumbnail = async(params: pageParams):Promise<paginationData> => {
    return api.post<Response<paginationData>>('/nuxeo/document/children/thumbnail', params ).then(res => res.data.data);
}
export const GetDocDetail = async(idOrPath:string):Promise<DocDetail> => {
    return api.post<Response<DocDetail>>('/nuxeo/document',{ idOrPath }).then(res => res.data.data);
}
export const getSpecificVersionApi = async(params):Promise<DocDetail> => {
    return api.post<Response<DocDetail>>('/nuxeo/getSpecificVersion',params).then(res => res.data.data);
}
export const GetDocDetailApi = async(idOrPath:string = '/'):Promise<DocDetail> => {
    return api.get('/nuxeo/document',{ params: { idOrPath } }).then(res => res.data.data);
}

type permissionType = {
   permission:string,
   print:boolean
}
type permissionStoredType = {
    [name: string]: permissionType
} 
const permissionStored:permissionStoredType = {}
export const GetDocPermission = async(idOrPath:string, userId:string):Promise<permissionType> => {
    if(!!permissionStored[`${idOrPath}-${userId}`]) {
        return permissionStored[`${idOrPath}-${userId}`]
    }
    const res = await api.get<Response<permissionType>>(`/nuxeo/document/acl/permission?docId=${idOrPath}&userId=${userId}`).then(res => res.data.data);
    permissionStored[`${idOrPath}-${userId}`] = res
    return res
}
export const patchDocApi = async(idOrPath: DocDetail):Promise<DocDetail> => {
    return api.patch<Response<DocDetail>>('/nuxeo/document', {idOrPath}).then(res => res.data.data);
}

export const getUserAndRights = async(idOrPath:string) => {
    return api.post(`/nuxeo/document/acl`, {idOrPath}).then(res => res.data.data);
}

export const GetBreadcrumb = async(idOrPath:string):Promise<BreadResponse> => {
    return api.post<Response<BreadResponse>>('/nuxeo/document/breadcrumb', { idOrPath }).then(res => res.data.data);
}

export const GetChild = async(idOrPath:string):Promise<GetChildResponse> => {
    return await api.post('/nuxeo/document/children', { idOrPath }).then(res => res.data.data);
}

export const GetDocumentAdditionalApi = async(params) => {
    if( window["docTypeCache"] && window["docTypeCache"][params.documentType]) {
        return window["docTypeCache"][params.documentType]
    }
    // check if response is cached
    const response = await api.get('/docpal/workflow/queryMetaValidationRule', { params }).then(res => res.data.data);
    if(!window["docTypeCache"]) {
        window["docTypeCache"] = {[params.documentType]: response}
        } else {
            window["docTypeCache"][params.documentType] = response
        }
    return response
    
}


export const GetDocumentPreview = async(idOrPath:string) => {
    return api.post('/nuxeo/document/preview', {
        idOrPath
    },{
        responseType: 'blob'
    }).then(res => res.data)
}

export const GetAnnotation = async(idOrPath:string):Promise<any[]> => {
    return api.get('/nuxeo/annotation', {params:{
        idOrPath
    }}).then(res =>res.data.data);
}

export const SaveAnnotation = async(data: any) => {
    return api.post('/nuxeo/annotation', data).then(res => res.data.data);
}
export const GetTemplateListApi = async() => {
    return api.post('/nuxeo/template/getTemplateList').then(res => res.data.data)
}
export const GetTemplateParamsApi = async(param) => {
    return api.post('/nuxeo/template/getTemplateParams', param).then(res => res.data.data)
}
export const DownloadTemplateApi = async(param) => {
    return api.post('/nuxeo/template/summitAndDownloadFile', param, {responseType: 'blob', timeout: 0}).then(res => res.data)
}
export const DownloadDocApi = async(idOrPath:string) => {
    return api.post('/nuxeo/document/download', {idOrPath}, {responseType: 'blob', timeout: 0}).then(res => res.data)
}
export const downloadDocRecord = async(params) => {
    return api.post('/nuxeo/document/download', params, {responseType: 'blob', timeout: 0}).then(res => res.data)
}

// #region module: file
    export const CreateFoldersApi = async(param) => {
        return api.post('/nuxeo/document/createFolders', param).then(res => res.data.data)
    }
    export const CreateDocumentApi = async(param) => {
        return api.post('/nuxeo/document/createDocument', param).then(res => res.data.data)
    }
    export const patchDocumentApi = async(param) => {
        return api.patch('/nuxeo/document', param).then(res => res.data.data)
    }
    export const trashApi = async(param: idOrPathParams[]) => {
        return api.delete('/nuxeo/document/trash', {data: param}).then(res => res.data.data)
    }
    export const copyDocumentApi = async(param: idOrPathParams[]) => {
        return api.post('/nuxeo/document/copy', param).then(res => res.data.data)
    }
    export const moveDocumentApi = async(param: idOrPathParams[]) => {
        return api.post('/nuxeo/document/move', param).then(res => res.data.data)
    }
    export const DocumentThumbnailGetApi = async(idOrPath:string) => {
        return api.post('/nuxeo/document/thumbnail', {idOrPath},{
            responseType: 'blob'
        }).then(res =>res.data)
    }

    export const duplicateDetectionApi = async(param) => {
        return api.post('/nuxeo/document/isDuplicateName', param).then(res => res.data.data.titles || {}).catch(err => ({}))
    }
    
// #endregion

// #region module: trash
    export const GetTrashApi = async(params: pageParams) => {
        const { entryList, totalSize }:any = await api.get('/nuxeo/document/trash',{ params }).then(res => res.data.data)
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
    export const getCollectionApi = async (params: pageParams = {}) => {
        const { entryList, totalSize } = await api.get('/nuxeo/collection', { params }).then(res =>res.data.data);
        return {entryList, totalSize}
    }
    export const removeCollectionApi = async (params: collectionRemoveDocParams) => {
        return await api.delete('/nuxeo/collection/remove', { data: params }).then(res =>res.data.data);
    }
    export const createCollectionApi = async (params: collectionCreateParams) => {
        return await api.post('/nuxeo/collection/create', params).then(res =>res.data.data);
    }
    export const getCollectionDocApi = async (idOrPath: string) => {
        return await api.post('/nuxeo/document/collections', {idOrPath}).then(res =>res.data.data);
    }
    export const getCollectionDoc = async (idOrPath: string) => {
        const { entryList, totalSize } = await api.post('/nuxeo/collection/documents', { idOrPath }).then(res =>res.data.data);
        return {entryList, totalSize}
    }

    export const addCollectionApi = async(param) => {
        return await api.post('/nuxeo/collection/add', param).then(res =>res.data.data);
    }

    export const getAllCollection = async () => {
        return await api.get('/nuxeo/collection/all').then(res =>res.data.data);
    }
// #endregion

// #region module: share
    export const shareRequestApi= async (params) => {
        const res = await api.post('/nuxeo/share/new', params).then(res =>res.data.data);
        return res
    }
    export const getShareListApi = async (params: pageParams) => {
        const res = await api.post('/nuxeo/share/get', params).then(res =>res.data.data);
        return { entryList: res.list, totalSize: res.total }
    }
    export const deleteShareListApi = async (params: string[]) => {
        const res = await api.delete('/nuxeo/share', {data: params}).then(res =>res.data.data);
        return { entryList: res.list, totalSize: res.total }
    }
    export const patchShareInfoApi = async (params: shareInfo) => {
        return await api.patch('/nuxeo/share', params).then(res =>res.data.data);
    }
// #endregion
// #region module:fileRequest
    export const getFileRequestListApi = async (params: pageParams) => {
        const res = await api.get('/nuxeo/filerequest', { params }).then(res =>res.data.data);
        return { entryList: res.requests, totalSize: res.total }
    }
    export const saveFileRequestListApi = async (params) => {
        const res = await api.post('/nuxeo/filerequest', params).then(res =>res.data.data);
        return res
    }
// #endregion

// #region module: documentType
    let docTypesStore = []
    export const getDocTypeListApi = async(refresh: boolean = false):Promise<DocType[]> => {
        if (docTypesStore.length > 0 && !refresh) return docTypesStore
        let response = await api.get<Response<DocType[]>>('/nuxeo/types').then(res => res.data.data);
        docTypesStore = [...response.sort((a,b)=> (a.name.localeCompare(b.name) ))]
        return docTypesStore
    }
    const metaStore = {}
    export const metaValidationRuleGetApi = async (documentType: string, refresh: boolean = false):Promise<Meta[]> => {
        if(documentType && metaStore[documentType] && !refresh) return metaStore[documentType]
        const response = await api.get('/docpal/workflow/queryMetaValidationRule', { params: { documentType } }).then(res => res.data.data);
        metaStore[documentType] = response
        return response
    }
// #endregion


export const getVersionsApi = (param: Object) => {
    return api.post('/nuxeo/getVersions', param).then(res => res.data.data)
}

// #region module: tag
export const PatchTags = async (params) => {
    return await api.patch('/nuxeo/tags', params).then(res => res.data.data)
}

export const DeleteTags = async (params) => {
    return await api.delete('/nuxeo/tags', { data: params }).then(res => res.data.data)
}

export const DocumentAddTags = async (params) => {
    return await api.post('/nuxeo/tags', params).then(res => res.data.data)
}

export const GetAllTags = async () => {
    return await api.post('/nuxeo/tags/getAllTags', {  }).then(res => res.data.data)
}

export const SearchTagByName = async (keyword) => {
    return await api.post('/nuxeo/tags/label', {keyword}).then(res => res.data.data)
}

// #endregion

// #region module: activities

export const getActivitiesApi = async (idOrPath: string) => {
    return await api.post('/nuxeo/document/audit', { idOrPath }).then(res => res.data.data);
}

// #endregion

// #region module: Convertsion

export const getConversionHistoryApi = async(params) =>  {
    return api.get('/nuxeo/conversion/getConversionHistory', {params}).then(res => res.data.data);
}

export const getSupportedFormatApi = async() => {
    return api.get('/nuxeo/conversion/getSupportedFormat').then(res => res.data.data);
}

export const submitExportRequestApi = async(params) => {
    return api.post('/nuxeo/conversion/submitExportRequest', params).then(res => res.data.data);
}

// #endregion


// #region module: adHoc
export const getAdHocHistory = async (documentId: string) => {
    return await api.post(`/docpal/workflow/queryAdhocApprovalPage`, {
        documentId,
        "pageNum": 1,
        "pageSize": 100
    }).then(res => res.data.data);
}

export const canApprovalAdhocApi = async (documentId: string, userId:string) => {
    return await api.get(`/docpal/workflow/isDocumetIdCanApproval`, {params: { documentId, userId }}).then(res => res.data.data);
}




// replace file

export const replaceFileDocumentApi = (params:any) => {
    return api.patch('/nuxeo/document/replaceFile', params).then(res => res.data.data);
}

// Restore file
export const restoreVersionApi = (params:any) => {
    return api.post('/nuxeo/restoreVersion', params).then(res => res.data.data);
}

// comment

// Restore file
export const CommentsAddApi = (params:any) => {
    return api.post('/nuxeo/comments/add', params).then(res => res.data.data);
}
export const CommentsDeleteApi = (params:any) => {
    return api.delete('/nuxeo/comments/delete', { data: params}).then(res => res.data.data);
}
export const CommentsGetApi = (params:any) => {
    return api.post('/nuxeo/comments', params).then(res => res.data.data);
}




