import {api} from "../index";


export const getAdminVirtualFolder = async():Promise<any[]> => {
    const res = await api.get('/nuxeo/admin/virtualfolder/setting').then((res) => res.data.data)
    return res.map((item) => ({
        id: item.id,
        ...JSON.parse(item.jsonValue)
    }))
}

export const removeAdminVirtualFolderById = async(id:string) => {
    return api.delete(`/nuxeo/admin/virtualfolder/setting/${id}`).then((res) => res.data.data);
}