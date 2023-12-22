import {api} from '../';

export const GetMetadataSettingApi = async(documentType: string) => {
    try {
        return api.post('/docpal/metadata/settings/all', { documentType }).then(res => res.data.data)
    } catch (error) {
        return []
    }
} 
export const DeleteMetadataSettingApi = async(id: string) => {
    return api.delete(`/docpal/metadata/settings/${id}`).then(res => res.data.data)
} 
export const CreateMetadataSettingApi = async(params: any) => {
    return api.post('/docpal/metadata/settings',  params ).then(res => res.data.data)
} 
export const UpdateMetadataSettingApi = async(params: any) => {
    return api.put('/docpal/metadata/settings',  params ).then(res => res.data.data)
} 

export const GetMetadataRelatedApi = async(documentType: string) => {
    try {
        return api.post('/docpal/metadata/settings/related/document/all', { documentType }).then(res => res.data.data)
    } catch (error) {
        return []
    }
} 
export const DeleteMetadataRelatedApi = async(relationId: string) => {
    return api.delete(`/docpal/metadata/settings/related/document/${relationId}`).then(res => res.data.data)
} 
export const CreateMetadataRelatedApi = async(params: any) => {
    console.log({params});
    
    return api.post('/docpal/metadata/settings/related/document',  params ).then(res => res.data.data)
} 
export const UpdateMetadataRelatedApi = async(params: any) => {
    return api.put('/docpal/metadata/settings/related/document',  params ).then(res => res.data.data)
} 
