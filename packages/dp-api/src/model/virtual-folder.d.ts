
export type VirtualFolderItemFile = {
    name: string,
    doctype: string,
    isFolder: boolean,
    parentMeta?: string,
    showChildren: boolean,
}

export type VirtualFolderItemFolder = {
    name: string,
    isFolder: true,
    children: VirtualFolderItem[]
}

export type VirtualFolderItem = VirtualFolderItemFile | VirtualFolderItemFolder

export type VirtualFolderDetail = {
    id?:string,
    name: string,
    userList:string[],
    groupList:string[],
    setting: VirtualFolderItem
}