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

export type UploadParams = {
    uploadFiles: uploadDoc[];
    status: any;
    parentPath: string;
    requestIndex: number;
    isChildren:boolean
}
// export const useUploadStore = defineStore('UploadStore', () => {
//     const uploadState = reactive({
//         uploadFiles: <any>[], // input输入
//         rootDoc: <DocDetail>{},
//         uploadRequestList: <any>[],
//         backPath: ''
//     })
//     function setUploadFiles (files: any, doc: DocDetail) {
//         uploadState.uploadFiles = files
//         uploadState.rootDoc = doc
//         uploadState.backPath = `/browse?path=${uploadState.rootDoc.path}`
//     }
//     function getBackPath () {
//         return uploadState.backPath
//     }
//     function getRootDoc () {
//         return uploadState.rootDoc
//     }
//     function getUploadFiles () {
//         const treeData:any = []
//         const treeMap: any = {}
//         uploadState.uploadFiles.forEach((item: any) => {
//             if(item.name.charAt(0) === '.')  return
//             if(item.path && !treeMap[item.path]) {
//                 const names = item.path.split('/')
//                 if (names.length === 0) return
//                 treeMap[item.path] = {
//                     id: item.path,
//                     isFolder: true,
//                     name: names.pop(),
//                     parentId: names.join('/'),
//                     documentType: 'Folder',
//                     children: []
//                 }
//             }
//             treeMap[item.id] = {
//                 id: item.id,
//                 isFolder: false,
//                 name: item.name,
//                 parentId: item.path,
//                 documentType: 'File',
//                 file: item.file
//             }
//         })
//         Object.keys(treeMap).forEach((key: any) => {
//             const item = treeMap[key]
//             const parent:any = treeMap[item.parentId]
//             if (parent) {
//                 parent.children.push(item)
//             } else {
//                 treeData.push(item)
//             }
//         })
//         return treeData
//     }
//     function updateUploadRequestList (docs: uploadDoc[]) {
//         const tree: any = []
//         const arr: any = []
//         Object.keys(docs).forEach((key: any) => {
//             const item = docs[key]
//             const parent: any = docs[item.parentId as any]
//             if (parent) {
//                 if (!parent.children) parent.children = []
//                 parent.children.push(item)
//             } else {
//                 tree.push(item)
//             }
//             arr.push(item)
//         })
        
//         const requestItem = {
//             rootDoc: uploadState.rootDoc,
//             startDate: new Date(),
//             tree,
//             docList: arr,
//             count: 0
//         }
//         uploadState.uploadRequestList.push(requestItem)
//         upload(tree, 'finish', uploadState.rootDoc.path, requestItem)
//     }
//     function upload(tree: uploadDoc[], status: any, parentPath: string, requestItem: uploadRequestItem) {
//         tree.forEach((item, index) => {
//             setTimeout(async() => {
//                 if(!status || status === 'finish') {
//                     const { isDuplicate } = await duplicateNameFilter(parentPath, [item]);
//                     if (isDuplicate) item.status = 'skip'
//                     else {
//                         if (parentPath === '/') parentPath = ''
//                         item.status = 'loading'
//                         const res = await handleCreateDocument(item, parentPath)
//                         item.status = res ? 'finish' : 'fail'
//                     }
//                 } else {
//                     item.status = 'skip'
//                 }
//                 requestItem.count++
//                 if (item.children) upload(item.children, item.status , parentPath + '/' + item.name, requestItem)
//             }, 1000 + index * 100)
//         })
//     }
    
//     async function handleCreateDocument (doc: any, parentPath: string) {
//         let result
//         const document = {
//           name: doc.name,
//           idOrPath: `${parentPath}/${doc.name}`,
//           type: doc.documentType,
//           properties: doc.properties
//         }
//         try {
//             if(doc.isFolder) {
//                 result = await CreateFoldersApi(document)
//             }
//             else {
//                 const formData = new FormData()
//                 formData.append('files', doc.file)
//                 formData.append('document', JSON.stringify(document))
//                 result = await CreateDocumentApi(formData)
//             }
//         } catch (error) {
//             result = false
//         }
//         return result
//     }
//     function getUploadRequestList () {
//         return uploadState.uploadRequestList
//     }
//     onMounted(() => {
//     })
//     return {
//         getUploadFiles,
//         setUploadFiles,
//         updateUploadRequestList,
//         getUploadRequestList,
//         getBackPath,
//         getRootDoc,
//         uploadState,
//     }
// })

export const useUploadStore = () => {
    const uploadState = useState('uploadState', () => ({
        uploadFiles: <any>[], // input输入
        rootDoc: <DocDetail>{},
        uploadRequestList: <any>[],
        backPath: ''
    }) )
    const uploadQueue = useState('uploadQueue', () => ({}) )
    function setUploadFiles (files: any, doc: DocDetail, backPath: string = '/browse') {
        uploadState.value.uploadFiles = files
        uploadState.value.rootDoc = doc
        uploadState.value.backPath = `${backPath}?path=${uploadState.value.rootDoc.path}`
    }
    function getBackPath () {
        return uploadState.value.backPath
    }
    function getRootDoc () {
        return uploadState.value.rootDoc
    }
    function getUploadFiles () {
        const treeData:any = []
        const treeMap: any = {}
        uploadState.value.uploadFiles.forEach((item: any) => {
            if(item.name.charAt(0) === '.')  return
            if(item.path && !treeMap[item.path]) {
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
            rootDoc: uploadState.value.rootDoc,
            startDate: new Date(),
            tree,
            docList: arr,
            count: 0
        }
        uploadState.value.uploadRequestList.push(requestItem)
        upload({
            uploadFiles: tree, 
            status:'finish', 
            parentPath :uploadState.value.rootDoc.path, 
            requestIndex: uploadState.value.uploadRequestList.length - 1, 
            isChildren:false
        })
    }

    function upload({uploadFiles, status, parentPath, requestIndex, isChildren}:UploadParams):void {
        uploadFiles.forEach((item, index) => {
            setTimeout(async() => {
                uploadState.value.uploadRequestList[requestIndex].count++
                if(!status || status === 'finish') {
                    
                    let skip = false;
                    if(!isChildren) {
                        const { isDuplicate } = await duplicateNameFilter(parentPath, [item]);
                        skip =!! isDuplicate
                        if (isDuplicate) item.status = 'skip';
                    }
                    if(skip) return;
                    // get index of the item
                    const index = uploadState.value.uploadRequestList[requestIndex].docList.findIndex((doc: any) => doc.id === item.id)

                    if (parentPath === '/') parentPath = ''
                    item.status = 'loading'
                    uploadState.value.uploadRequestList[requestIndex].docList[index].status = 'loading'
                    const res = await handleCreateDocument(item, parentPath)
                    item.status = res ? 'finish' : 'fail'
                    uploadState.value.uploadRequestList[requestIndex].docList[index].status = res ? 'finish' : 'fail'
                    console.log("item update", uploadState.value.uploadRequestList[requestIndex].docList[index].status)
                } else {
                    item.status = 'skip'
                }
                
                if (item.children){
                    upload({
                        uploadFiles: item.children, 
                        status: item.status, 
                        parentPath : parentPath + '/' + item.name, 
                        requestIndex, 
                        isChildren:true
                    })
                }
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
        return uploadState.value.uploadRequestList
    }

    return {
        getUploadFiles,
        setUploadFiles,
        updateUploadRequestList,
        getUploadRequestList,
        getBackPath,
        getRootDoc,
        uploadState,
    }
}
