import { defineStore } from 'pinia'
export type uploadDoc = {
    documentType: string,
    id: string,
    isFolder: boolean,
    parentId: string,
    name: string,
    file: any
}
export const useUploadStore = defineStore('UploadStore', () => {
    const state = reactive({
        uploadFiles: <any>[], // input输入
        uploadDocList: <any>[], // 右上角上传功能
        rootDoc: <any>{}
    })
    function setUploadFiles (files: any, doc: any) {
        state.uploadFiles = files
        state.rootDoc = doc
    }
    function getUploadFiles () {
        const treeData:any = []
        const treeMap: any = {}
        state.uploadFiles.forEach((item: any) => {
            if(!treeMap[item.path]) {
                const names = item.path.split('/')
                if (names.length === 0) return
                treeMap[item.path] = {
                    id: item.path,
                    isFolder: true,
                    name: names.pop(),
                    parentId: names.join('/'),
                    documentType: 'Folder',
                    children: []
                }
            }
            treeMap[item.id] = {
                id: item.id,
                isFolder: false,
                name: item.name,
                parentId: item.path,
                documentType: 'File',
                file: item.file
            }
        })
        Object.keys(treeMap).forEach((key: any) => {
            const item = treeMap[key]
            const parent:any = treeMap[item.parentId]
            if (parent) {
                parent.children.push(item)
            } else {
                treeData.push(item)
            }
        })
        return treeData
    }
    function setUploadDocList (docs: uploadDoc[]) {
        state.uploadDocList = docs
    }
    function getUploadDocList (docs: uploadDoc[]) {
        return {
            rootDoc: state.rootDoc,
            list: state.uploadDocList
        }
    }
    onMounted(() => {
    })
    return {
        getUploadFiles,
        setUploadFiles,
        setUploadDocList,
        getUploadDocList,
        state
    }
})
