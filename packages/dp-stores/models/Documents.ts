export type DocumentMeta = {
    [key:string] : string | any[];
}

export type DocumentSetting = {
    fileType?: string[]
    meta?: DocumentMeta & {
        parentKey?: string
    }
    related?:string[],
    label?: string,
    isRoot?: boolean,
    isFolder?: boolean
}

export type Document = {
    id: string;
    name: string;
    path?: string;
    type?: string;
    version?: string;
    createdBy?: string;
    createdDate?: string;
    modifiedDate?: string;
    isFolder?: boolean;
    expanded?: boolean;
    showInput?: boolean;
    handleType?: string;
    properties?: DocumentMeta;
    children?: Document[]
} & DocumentSetting

export type VirtualFolder = {
    id: string,
    name: string,
    isFolder?: boolean, 
    rootLabel?: string,
    propsTree?: Document[],
    docSetting?: { [key:string] :DocumentSetting }
}

export type Meta = {
    id: string,
    dataType: string,
    display: boolean,
    documentType?: string,
    metaData: string,
    isRequire: boolean,
    length?: any,
    vocabulary?: string,
    creatorId?: string,
    creatorName?: string,
    creationTime?: string,
    modifiedId?: string,
    modifiedName?: string,
    modifiedTime?: string,
    status?: any,
    directoryEntries?: any,
    value?: any
}
