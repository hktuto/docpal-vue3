import {
  duplicateDetectionApi, 
  GetDocDetail, 
  GetDocPermission, 
  GetDocumentAdditionalApi, 
  DocDetail,
  GetDocumentHoldApi,
  DownloadDocApi,
  exportFolderStructureApi
} from "dp-api";
import * as mime from 'mime-types'
import { Download, Loading } from '@element-plus/icons-vue';
import { ElNotification, ElMessage} from 'element-plus'
export const isRoot = (path:string):boolean => {
    return path === "/";
};

export const getParentPath = (path:string):string => {
    const arr = path.split("/");
    arr.pop();
    return arr.join("/");
};

export const getUniqueName = async(file:any) => {
    try {
        const fileName = file.fileName || file.name
        const res = await duplicateDetectionApi({ path: file.goPath, titles: [ fileName ]})
        const name = res[fileName]?.uniqueName || fileName
        return name
    } catch (error) {
        return file.fileName || file.name
    }
}

/**
 *
 * @param idOrPath parent id or path
 * @param list list of files to check for duplicates
 * @returns {isDuplicate: boolean, list: any[]}
 */
export const duplicateNameFilter = async (idOrPath: string, list:any) => {
  try {
      let result = false
      const titles = list.reduce((prev:any, item:any) => {
        prev.push(item.fileName || item.name)
        return prev
      }, [])
      const res = await duplicateDetectionApi({path:idOrPath, titles})
      list.forEach((doc:any) => {
        const name = doc.fileName || doc.name
        if (res[name] || res[name]) {
          result = true
          doc.goPath = idOrPath
          doc.isDuplicate = true
          doc.originalPath = res[name].idOrPath
          doc.uniqueName = res[name].uniqueName
        }
      })
      return {
        isDuplicate: result,
        list,
      }
    } catch (error) {
      console.log(error);
      return {
        isDuplicate: true,
        list: []
      }
    }
  }

/**
 *
 * @param idOrPath document id or path to get details for
 * @param userId user id to check permissions for, if null, no permissions will be returned
 */
export const getDocumentDetail = async (idOrPath: string, userId?:string) => {
  const response = await GetDocDetail(idOrPath);
  try {
    response.displayMeta = await GetDocumentAdditionalApi({documentType: response.type})
    if(userId) {
      const idPath = response.path === '/' ? '/' : idOrPath
      const permission:any = await GetDocPermission(idPath, userId);
      if(!permission) throw new Error("no permission");
      response.canWrite = AllowTo({feature:'ReadWrite', permission: permission })
      response.canEdit = AllowTo({feature:'ReadWrite', permission: permission })
      return {
        permission,
        doc: response
      }
    }
    throw new Error("no userId");
  } catch (error) {
    return {
      permission: {},
      doc: response
    };
  }  
    
}
export const getDocumentDetailSync = async (idOrPath: string, userId?:string) => {
  let doc: any = {
  }
  let permission: any = {}
  try {
    doc = await GetDocDetail(idOrPath)
    let pList = []
    pList.push(getDocumentAdditional(doc.type))
    pList.push(getPermission())
    // pList.push(getHoldStatus(doc.id))
    await Promise.all(pList) 
  } catch (error) {}
  return { doc, permission }

  async function getDocumentAdditional (documentType: string) {
    doc.displayMeta = await GetDocumentAdditionalApi({ documentType })
  }
  async function getPermission() {
    if(userId && doc.id) {
      const idPath = doc.path === '/' ? '/' : doc.id
      const _permission:any = await GetDocPermission(idPath, userId);
      if(!_permission.hold) _permission.hold = {}
      if(!!_permission) permission = _permission
    }
  }
  async function getHoldStatus(id: string) {
    const res = await GetDocumentHoldApi(id)
    doc.holdStatus = res?.status || ''
    doc.holdDetail = res
  } 
}
const deepCopy  = (data:any) => {
    if (!data) return {}
    return JSON.parse(JSON.stringify(data));
}

export type FileDetailOptions = {
    showInfo: boolean,
    showHeaderAction: boolean,
    openEdit: boolean
}
export const openFileDetail = (pathOrId:string, options: FileDetailOptions) => {
    const ev = new CustomEvent('openFilePreview', {detail: {
            pathOrId,
            options
        }})
    console.log('open detail', ev)
    document.dispatchEvent(ev);
}

export function downloadUrl(url:string, name:string){
  const a = document.createElement('a')
  a.id = 'file_' + Date.now();
  a.href = url
  a.download = name;
  a.click()
  window.URL.revokeObjectURL(url)
  a.remove();
}

export function calFileNameAndExt(mimeType: string, name: string):string {
  const ext = mime.extension(mimeType);
  // check name include extension
  if(ext){
    return name + '.' + ext;
  } else {
    return name;
  }
  
}

/**
 * Retrieves the mime type from a given document object.
 *
 * @param {any} doc - The document object from which to retrieve the mime type.
 * @returns {string} The mime type of the document. If the mime type is not available, it returns an empty string.
 */
export function getMimeTypeFromDocument(doc:any):string | undefined{
  const properties = doc.properties as any
  const mimeType:string = properties["file:content"] && properties["file:content"]["mime-type"] ? properties["file:content"]["mime-type"] : '';
  if(!mimeType) return undefined;
  return mimeType
}

export function canCollaboraEdit(mimeType:string) {
  // is mimeType is .doc or .docx file
    // check is doc or docx
    const excelType = ['application/vnd.ms-excel', 'application/msexcel', 'application/x-msexcel', 'application/x-ms-excel', 'application/x-excel', 'application/x-dos_ms_excel','application/xls','application/x-xls','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    if(excelType.includes(mimeType)) return true;
    const wordType = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-word.template.macroEnabled.12']
    if(wordType.includes(mimeType)) return true;
    const pptType = ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
    if(pptType.includes(mimeType)) return true;

    if(mimeType.includes('application/vnd.collabora') || mimeType.includes('application/vnd.collabora-project'))  return true;
  return false;
}

export function downloadBlob (blob:any, name:string, type = "application/octet-stream") {
  
  const blobStream = new Blob([blob], { type })
  const fileName = name.includes('.') ? name : calFileNameAndExt(blob.type, name);
  console.log(fileName, blob.type)
  const url = window.URL.createObjectURL(blobStream)
  downloadUrl(url, fileName)
}
export function downloadHandler(doc: any) {
  console.log(doc.isFolder);
  
  if(!doc.isFolder) downloadFileHandler(doc)
  else downloadFolderHandler(doc)
}
export async function downloadFolderHandler(doc: any) {
  const noti = ElNotification({
    title: '',
    dangerouslyUseHTMLString: true,
    icon: Loading,
    message: `downloading ~ ${doc.name}`,
    showClose: false,
    customClass: 'loading-notification',
    duration: 0,
    position: 'bottom-right'
  });
  const res = await exportFolderStructureApi(doc.id, doc.name)
  noti.close()
}
export async function downloadFileHandler(doc: any){
  console.log(doc);
  
  // exportFolderStructureApi
  const id = new Date().valueOf() + doc.name
  const notification = ElNotification({
    title: '',
    icon: Download,
    dangerouslyUseHTMLString: true,
    message: `<span id="${id}">0%</span> ${doc.name}`,
    showClose: false,
    customClass: 'download-notification',
    duration: 0,
    position: 'bottom-right'
  });
  try{
    const blob = await DownloadDocApi(doc.id, (e: any) => {
      const el = document.getElementById(id)
      if(el) el.innerHTML = Math.round((e.loaded / e.total) * 100) + '%'
    })
    await downloadBlob(blob, doc.name)
    // await DownloadDocApi(props.doc.id)
  } catch(error:any) {
    ElMessage.error($t('download_noFile') as string)
  }
  setTimeout(() => {
    notification.close()
  }, 3000)
}
