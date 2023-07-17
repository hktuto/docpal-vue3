import { api } from '../';
export const CreateInternalShareApi = async(params) => {
    const res = await api.post('/docpal/internalShare', params).then(res => res.data.data)
    return res
}
