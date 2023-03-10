
import { pageParams } from './api'
export type GetChildResponse = {
    id: string,
    isFolder : boolean,
    modifiedDate: string,
    name: string,
    path: string
}
export const GetChildThumbnail = async(idOrPath: string):Promise<GetChildResponse> => {
    return api<GetChildResponse>('/nuxeo/document/children/thumbnail', {
        method:'POST' ,
        body:{ idOrPath },
    })
}

export type DocDetail = {
    createdBy?:string,
    createdDate?:string,
    modifiedDate?: string,
    description?:string,
    id: string,
    name: string,
    path: string,
    isCheckedOut: boolean,
    isFolder: boolean,
    logicalPath?: string,
    parentRef: string,
    properties:{
        "common:icon":string,
        "common:icon-expanded"?:string,
        "dc:contributors": string[],
        "dc:coverage"?: string[],
        "dc:created" : string,
        "dc:creator" : string,
        "dc:description" ?: string,
        "dc:expired" ?: string,
        "dc:format" ?: any,
        "dc:issued" ?: any,
        "dc:language" ?: any,
        "dc:lastContributor" : string,
        "dc:modified" : string,
        "dc:nature" ?: any,
        "dc:publisher" ?: any,
        "dc:rights" ?: any,
        "dc:source" ?: any,
        "dc:subjects" ?: any[],
        "dc:title" : string,
        "dc:valid" ?: any,
    },
    type: string,
    version: string

}
export const GetDocDetail = async(idOrPath:string) => {
    return api<DocDetail>('/nuxeo/document', {
        method:'POST' ,
        body:{ idOrPath },
    })
}

export type BreadResponse = {

}
export const getBreadcrumb = async(idOrPath:string) => {
    return api<GetChildResponse>('/nuxeo/document/breadcrumb', {
        method:'POST' ,
        body:{ idOrPath },
    })
}

export const getChild = async(idOrPath:string) => {
    return api<GetChildResponse>('/nuxeo/document/children', {
        method:'POST' ,
        body:{ idOrPath },
    })
}

export const GetDocumentPreview = async(idOrPath:string) => {
    return api('/nuxeo/document/preview', {
        method:'POST',
        body: {
            idOrPath
        },
        responseType: 'blob'
    })
}

export const GetAnnotation = async(idOrPath:string) => {
    return api('/nuxeo/annotation', {
        method: 'GET',
        params:{
            idOrPath
        }
    })
}
export const getTrashApi = async(params: pageParams) => {
    const { entryList, totalSize } = await api('/nuxeo/document/trash', {
        method: 'GET',
        params
    })
    return { entryList, totalSize }
}

export const deleteByIdApi = async (idOrPath: string) => {
    try {
        const res = await api('/nuxeo/document', { 
            method: 'DELETE',
            body: { idOrPath }
        })
        return true
    } catch (error) {
        return false
    }
}
export const restoreByIdApi = async (idOrPath: string) => {
    try {
        const res = await api('/nuxeo/document/restore', { 
            method: 'POST',
            body:{ idOrPath }
        })
        return true
    } catch (error) {
        return false
    }
}

