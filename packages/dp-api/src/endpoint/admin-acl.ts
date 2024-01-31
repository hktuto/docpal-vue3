import {api} from '../';

export const getAclsApi = async(idOrPath: string) => {
    const res = await api.get(`/nuxeo/document/${idOrPath}/acls`).then(res => res.data.data)
    return res
}
export const removeACLApi = async(params) => {
    const res = await api.delete('/nuxeo/document/acl/remove', {params}).then(res => res.data.data)
    return res
}
export const addACLApi = async(params) => {
    const res = await api.post('/nuxeo/document/acl/add', params).then(res => res.data.data)
    return res
}
export const replaceACLApi = async(params) => {
    const res = await api.put('/nuxeo/document/acl/replace/', params).then(res => res.data.data)
    return res
}
export const aclBlockApi = async(idOrPath) => {
    const res = await api.post('/nuxeo/document/acl/block', [{ idOrPath }]).then(res => res.data.data)
    return res
}
export const aclUnblockApi = async(idOrPath) => {
    const res = await api.post('/nuxeo/document/acl/unblock', [{ idOrPath }]).then(res => res.data.data)
    return res
}

export const exportFolderStructureApi = async(idOrPath: string, name: string = "export") => {
    try{
      const res = await api.post('/nuxeo/folderStructure/export', { idOrPath }, { 
        responseType: 'blob', 
        timeout: 0,
        headers: {'white': 'true'}
    })
      // @ts-ignore
      downloadBlob(res.data, name + '.zip', res.data.type )
      return res
    }catch(error){
      return false
    }
  }
