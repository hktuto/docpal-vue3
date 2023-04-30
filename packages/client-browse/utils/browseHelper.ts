import { duplicateDetectionApi } from "dp-api";

export const isRoot = (path:string):boolean => {
    return path === "/";
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

export const duplicateNameFilter = async (idOrPath: string, list:any) => {
    try {
      let result = false
      const titles = list.reduce((prev:any, item:any) => {
        prev.push(item.fileName || item.name)
        return prev
      }, [])
      const res = await duplicateDetectionApi({path:idOrPath, titles})
      list.forEach((doc:any) => {
        if (res[doc.name]) {
          result = true
          doc.goPath = idOrPath
          doc.isDuplicate = true
          doc.originalPath = res[doc.name].idOrPath
          doc.uniqueName = res[doc.name].uniqueName
        }
      })
      return {
        isDuplicate: result,
        list,
      }
    } catch (error) {
      return {
        isDuplicate: false,
        list: []
      }
    }
  }