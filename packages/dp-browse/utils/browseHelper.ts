import {duplicateDetectionApi, GetDocDetail, GetDocPermission, GetDocumentAdditionalApi} from "dp-api";
import * as mime from 'mime-types'
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
  console.log({list});
  
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
  console.log("getDocumentDetail", idOrPath)
  const response = await GetDocDetail(idOrPath);
  try {
    response.displayMeta = await GetDocumentAdditionalApi({documentType: response.type})
    if(userId) {
      const idPath = response.path === '/' ? '/' : idOrPath
      const permission:any = await GetDocPermission(idPath, userId);
      if(!permission) throw new Error("no permission");
      response.canWrite = AllowTo({feature:'ReadWrite', userPermission:permission.permission })
      response.canEdit = AllowTo({feature:'ReadWrite', userPermission:permission.permission })
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
const deepCopy  = (data:any) => {
    if (!data) return {}
    return JSON.parse(JSON.stringify(data));
}

export type FileDetailOptions = {
    showInfo: boolean,
    showHeaderAction: boolean
}
export const openFileDetail = (pathOrId:string, options: FileDetailOptions) => {
    const ev = new CustomEvent('openFilePreview', {detail: {
            pathOrId,
            options
        }})
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

export function downloadBlob (blob:any, name:string, type = "application/octet-stream") {
  const blobStream = new Blob([blob], { type })
  const fileName = name.includes('.') ? name : calFileNameAndExt(blob.type, name);
  const url = window.URL.createObjectURL(blobStream)
  downloadUrl(url, fileName)
}
