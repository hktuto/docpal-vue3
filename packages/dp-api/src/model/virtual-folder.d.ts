
export type VirtualFolderItemType = 'doc' | 'folder'

export type VirtualFolderItemBase = {
    name: string,
    isFolder: boolean,
    type : VirtualFolderItemType,
}

export type DocItem = VirtualFolderItemBase &  {
    type : 'doc',
    docType: string,
    parentMeta: string,
    includeChildren: boolean // if docType is Folder, this option define whether include children,
}

export type FolderItem = VirtualFolderItemBase & {
    type : 'folder',
    labelTemplate: "" //  template string that use parent meta data to generate label
    children: VirtualFolderItem[]
}

export type VirtualFolderItem = DocItem | FolderItem

export type VirtualFolderDetail = {
    id?:string,
    name: string,
    userList:string[],
    groupList:string[],
    setting?: VirtualFolderItem
}