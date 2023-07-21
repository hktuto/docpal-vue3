import {api} from '../';
// import { getPreviewParams } from '../model';
export const publicFileRequestGetApi = async(params) => {
    try {
        return api.get('/nuxeo/public/filerequest', { params }).then(res => res.data.data)
    } catch (error) {
        return error?.response?.data
    }
}
export const publicFileRequestSaveApi = async(params) => {
    try {
        const res = api.post('/nuxeo/public/filerequest', params, { timeout: 0 }).then(res => res.data.result)
        return res || true
    } catch (error) {
        return false
    }
}
