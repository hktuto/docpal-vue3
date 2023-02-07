
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

}
export const GetDocDetail = async(id:string) => {
    return api<GetChildResponse>('/nuxeo/document', {
        method:'POST' ,
        params:{ id },
    })
}

export const getBreadcrumb = async(idOrPath:string) => {
    console.log("getBreadcrumb");
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