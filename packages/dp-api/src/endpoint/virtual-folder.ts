import {api} from '../';

export type vMode = 'groupAllowList' | 'userAllowList'
export const GetVirtualfolderApi = async() => {
    try {
        let response = await api.get('/nuxeo/admin/virtualfolder/setting').then(res => res.data.data)
        response = response.map(item => {
            return {
                id: item.id,
                ...JSON.parse(item.jsonValue)
            }
        })
        return response
    } catch (error) {
        return []
    }
}
export const saveAdminVirtualfolder = async(param) => {
    const response = await api.put('/nuxeo/admin/virtualfolder/setting', param);
    return response;  
}

export const getRelatedChild = async(idOrPath: string) => {

    const res = await api.get(`/nuxeo/admin/virtualfolder/setting/${idOrPath}`).then(res => res.data.data)
    if (res.jsonValue) {
        return { id: res.id, ...JSON.parse(res.jsonValue)}
    } else  {
        return {
        }
    }
}
