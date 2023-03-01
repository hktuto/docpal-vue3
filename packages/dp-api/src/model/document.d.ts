export type GetChildResponse = {
    id: string,
    isFolder : boolean,
    modifiedDate: string,
    name: string,
    path: string
}

export type pageParams = {
    pageIndex?: number,
    pageNum?: number,
    pageSize : number,
    [key: string]: any
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

export type BreadResponse = {

}

