import { uploadRequest } from './uploadAI';
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { SaveUploadFileOverviewApi, DocDetail, UploadTempFileApi, UploadTempFolderApi } from 'dp-api'
import { isTemplateExpression } from 'typescript'
export type uploadRequest = {
    doc: any,
    startDate: Date,
    docList: any[],
    finishCount: number,
    uploadAiId: string
}
export const useUploadAIStore = () => {
    const userId = useUser().getUserId()
    const uploadState = useState('uploadAIState', () => ({
        uploadRequestList: <uploadRequest[]>[],
    }) )
    async function createUploadRequest(doc: any, files: any[]) {
        const docList = getUploadFiles(files)
        const uploadAiId = await SaveUploadFileOverviewApi(userId, docList.length)
        if(!uploadAiId) return false
        uploadState.value.uploadRequestList.push(
            {
                doc,
                startDate: new Date(),
                docList,
                finishCount: 0,
                uploadAiId,
                aiFinish: false
            }
        )
        const curRequest = uploadState.value.uploadRequestList[uploadState.value.uploadRequestList.length - 1]
        curRequest.docList.forEach((docItem: any) => {
            docItem.uploadId = uploadAiId
            handleCreateDocument(docItem, doc.path, curRequest)
        });
        return uploadState.value
    }
    function getUploadFiles (files: any[]) {
        const treeData:any = []
        const treeMap: any = {}
        files.forEach((item: any) => {
            if(item.name.charAt(0) === '.' || item.path.includes('/.'))  return
            if(item.path && !treeMap[item.path]) {
                const names = item.path.split('/')
                if (names.length === 0) return
                let _namePaths: string[] = []
                names.forEach((_name: string) => {
                    _namePaths.push(_name)
                    if (_namePaths.length < 2) return
                    const _path = _namePaths.join('/')
                    if(!treeMap[_path]) {
                        const __namePaths = structuredClone(_namePaths)
                        treeMap[_path] = {
                            id: _path,
                            isFolder: true,
                            name: __namePaths.pop(),
                            parentId: __namePaths.join('/'),
                            documentType: 'Folder',
                            children: [],
                            status: 'loading'
                        }
                    }
                })
            }
            treeMap[item.path + '/' +item.name] = {
                id: item.path + '/' +item.name,
                isFolder: false,
                name: item.name,
                parentId: item.path,
                documentType: 'File',
                file: item.file,
                progress: 0,
                status: 'loading'
            }
        })
        Object.keys(treeMap).forEach((key: any) => {
            const item = treeMap[key]
            treeData.push(item)
            // const parent:any = treeMap[item.parentId]
            // if (parent) {
            //     parent.children.push(item)
            // } else {
            //     treeData.push(item)
            // }
        })
        return treeData
    }
    function getFileName(name) {
        const names = name.split('.')
        names.pop()
        return names.join('.')
    }
    async function handleCreateDocument (doc: any, parentPath: string, uploadRequestItem: uploadRequest) {
        let result
        const _document = {
            fileName: doc.name,
            fileType: doc.documentType,
            fileAbsolutePath: parentPath + doc.id,
            fileRelativePath: doc.id,
            uploadId: doc.uploadId,
            userId
        }
        try {
            if(doc.isFolder) {
                result = await UploadTempFolderApi(_document)
            }
            else {
                const formData = new FormData()
                formData.append('file', doc.file)
                formData.append('uploadTempFileRequestStr', JSON.stringify(_document))
                result = await UploadTempFileApi(formData, (e: any) => {
                    doc.progress = Math.round((e.loaded / e.total) * 100)
                })
            }
            doc.status = 'success'
        } catch (error) {
            result = false
            doc.status = 'exception'
        }
        uploadRequestItem.finishCount ++
        return result
    }
    function getUploadRequestList () {
        return uploadState.value.uploadRequestList
    }

    function arrayToTree (arr: any[], idKey: string = 'id') {
        // 空数组
        const map: any = {}
        const result: any = []
        if (!Array.isArray(arr)) return result // 判断不是数组  直接返回
        arr.forEach(item => {  delete item.children }) // 清空children
        arr.forEach(item => { map[item[idKey]] = item })
        arr.forEach(item => {
            const parent = map[item.parentId]
            if (parent) {
                if (!parent.children) parent.children = []
                parent.children.push(item)
            } else {
                result.push(item)
            }
        })
        return result
      }
    return {
        createUploadRequest,
        getUploadFiles,
        getUploadRequestList,
        uploadState,
        arrayToTree
    }
}
