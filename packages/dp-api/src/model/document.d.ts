export type GetChildResponse = {
    id: string,
    isFolder : boolean,
    modifiedDate: string,
    name: string,
    path: string
}

export type DocDetail = {
    createdBy?:string,
    createdDate?:string,
    modifiedDate?: string,
    description?:string,
    id: string,
    idOrPath?: string,
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
    documentType?: string,
    version: string
    displayMeta?: any
    canWrite ?: boolean,
    canEdit ?: boolean,
    isDuplicate ?: boolean,
}
export type DocType = {
    isFolder: boolean,
    name: string,
    keywords: DocTypeMeta[]
}
export type DocTypeMeta = {
    name: string,
    type: string,
    value: any
}
export type Meta = {
    creationTime: string,
    creatorId: string,
    creatorName: string,
    dataType: string,
    directoryEntries: any,
    display: true
    documentType: string,
    id: number | string,
    isRequire: false
    length: number,
    metaData: string,
    modifiedId: string,
    modifiedName: string,
    modifiedTime: string,
    status: number,
    vocabulary: string,
}
export type BreadResponse = {

}
export type collectionCreateParams = {
    name: string,
    description: string
}
export type collectionRemoveDocParams = {
    documents: idOrPathParams[],
    collection: idOrPathParams
}
export type idOrPathParams = {
    idOrPath: string
}

export type shareInfo = {
    accessToken ?: string,
    created ?: string,
    documentSize ?: number,
    easyShareList ?: any[],
    emailList ?: string[],
    expiredDate ?: string,
    shareID ?: string
}

