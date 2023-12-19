import { api } from '../';
export const exportFolderStructureApi = async(idOrPath: string, name: string = "export") => {
    const res = await api.post('/nuxeo/folderStructure/export', 
        { idOrPath }, 
        { 
            responseType: 'blob', 
            timeout: 0,
            headers: {'white': 'true'}
        }
    ).then(res =>{
        console.log(res)
        return res.data
    } )
    return res
}
