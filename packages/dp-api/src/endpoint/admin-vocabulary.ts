import {api} from '../';
export const GetVocabularyIdsApi = async() => {
    const res = await api.get('/nuxeo/vocabulary/listVocabularyIds').then(res => res.data)
    return res
}