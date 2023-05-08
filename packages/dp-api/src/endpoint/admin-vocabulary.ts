import {api} from '../';
export const GetVocabularyIdsApi = async() => {
    const res = await api.get('/nuxeo/vocabulary/listVocabularyIds').then(res => res.data)
    return res
}

export const GetVocabularyApi = async(id) => {
    const res = await api.get(`/nuxeo/vocabulary/${id}`).then(res => res.data)
    return res
}
export const AddVocabularyApi = async(id, params) => {
    const res = await api.post(`/nuxeo/vocabulary/${id}/entry`, params).then(res => res.data)
    return res || { id: params.id, state: true }
}
export const DeleteVocabularyApi = async(id, params) => {
    const res = await api.delete(`/nuxeo/vocabulary/${id}/entry`, {params: {
        entryId: params.id
      }}).then(res => res.data)
    return res
}
export const UpdateVocabularyApi = async(id, params) => {
    const res = await api.patch(`/nuxeo/vocabulary/${id}/entry`, params).then(res => res.data)
    return res || { id: params.id, state: true }
}
