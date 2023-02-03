
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