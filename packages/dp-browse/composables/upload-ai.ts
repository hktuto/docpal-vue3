import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
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

export const useUploadStore = () => {
    const uploadState = useState('uploadState', () => ({
        uploadFiles: <any>[], // input输入
        rootDoc: <DocDetail>{},
        uploadRequestList: <any>[],
        backPath: ''
    }) )
    function addUploadRequest(rootDoc: any, data: any[]) {

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
                            children: []
                        }
                    }
                })
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
    
    async function handleCreateDocument (doc: any, parentPath: string) {
        let result
        const _document = {
          name: doc.name,
          idOrPath: `${parentPath}/${doc.name}`,
          type: doc.documentType,
          properties: doc.properties
        }
        try {
            if(doc.isFolder) {
                result = await CreateFoldersApi(_document)
            }
            else {
                const formData = new FormData()
                formData.append('files', doc.file)
                formData.append('document', JSON.stringify(_document))
                result = await CreateDocumentApi(formData, (e: any) => {
                    const id =`${doc.id}_progress`
                    const el = document.getElementById(id)
                    if(el) el.innerHTML = `${Math.round((e.loaded / e.total) * 100)}%`
                })
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
        getUploadRequestList,
        uploadState,
    }
}
