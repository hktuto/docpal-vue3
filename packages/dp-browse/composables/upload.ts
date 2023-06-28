import { defineStore } from 'pinia'
import { DocDetail, CreateDocumentApi, CreateFoldersApi } from 'dp-api'
export type uploadDoc = {
    documentType: string,
    id: string,
    isFolder: boolean,
    parentId: string,
    name: string,
    file: any,
    status: 'finish' | 'skip' | 'fail' | 'loading' | 'pending', 
    children: uploadDoc[]
}

export type uploadRequestItem = {
    rootDoc: DocDetail;
    startDate: Date,
    docList: uploadDoc[];
    tree: uploadDoc[];
    count: number;
}
export const useUploadStore = defineStore('UploadStore', () => {
    const uploadState = reactive({
        uploadFiles: <any>[], // input输入
        rootDoc: <DocDetail>{},
        uploadRequestList: <any>[]
    })
    function setUploadFiles (files: any, doc: DocDetail) {
        uploadState.uploadFiles = files
        uploadState.rootDoc = doc
    }
    function getUploadFiles () {
        const treeData:any = []
        const treeMap: any = {}
        uploadState.uploadFiles.forEach((item: any) => {
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
    function updateUploadRequestList (docs: uploadDoc[]) {
        const tree: any = []
        const arr: any = []
        Object.keys(docs).forEach((key: any) => {
            const item = docs[key]
            const parent: any = docs[item.parentId as any]
            if (parent) {
                if (!parent.children) parent.children = []
                parent.children.push(item)
            } else {
                tree.push(item)
            }
            arr.push(item)
        })
        
        const requestItem = {
            rootDoc: uploadState.rootDoc,
            startDate: new Date(),
            tree,
            docList: arr,
            count: 0
        }
        uploadState.uploadRequestList.push(requestItem)
        upload(tree, 'finish', uploadState.rootDoc.path, requestItem)
    }
    function upload(tree: uploadDoc[], status: any, parentPath: string, requestItem: uploadRequestItem) {
        tree.forEach((item, index) => {
            setTimeout(async() => {
                if(!status || status === 'finish') {
                    const { isDuplicate } = await duplicateNameFilter(parentPath, [item]);
                    if (isDuplicate) item.status = 'skip'
                    else {
                        if (parentPath === '/') parentPath = ''
                        item.status = 'loading'
                        const res = await handleCreateDocument(item, parentPath)
                        item.status = res ? 'finish' : 'fail'
                    }
                } else {
                    item.status = 'skip'
                }
                requestItem.count++
                if (item.children) upload(item.children, item.status , parentPath + '/' + item.name, requestItem)
            }, 1000 + index * 100)
        })
    }
    
    async function handleCreateDocument (doc: any, parentPath: string) {
        let result
        const document = {
          name: doc.name,
          idOrPath: `${parentPath}/${doc.name}`,
          type: doc.documentType,
          properties: doc.properties
        }
        try {
            if(doc.isFolder) {
                result = await CreateFoldersApi(document)
            }
            else {
                const formData = new FormData()
                formData.append('files', doc.file)
                formData.append('document', JSON.stringify(document))
                result = await CreateDocumentApi(formData)
            }
        } catch (error) {
            result = false
        }
        return result
    }
    function getUploadRequestList () {
        return uploadState.uploadRequestList
    }
    onMounted(() => {
    })
    return {
        getUploadFiles,
        setUploadFiles,
        updateUploadRequestList,
        getUploadRequestList,
        uploadState
    }
})
