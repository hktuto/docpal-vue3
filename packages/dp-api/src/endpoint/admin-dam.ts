import {api} from '../';

export const GetDamsApi = async() => {
    const res = await api.post(`/docpal/dam/getAllSetting`).then(res => res.data)
    return mergeDataByKey(res.list, 'sourceType')
}
const mergeDataByKey = (arr, key) => {
    const map = {}
    const result = []
    arr.forEach(item => {
        if(item.operation) item.operation = JSON.parse(item.operation)
        if(map[item[key]]) {
            map[item[key]].list.push({ ...item })
        } else {
            map[item[key]] = { [key]: item[key], list: [{ ...item }]}
            result.push(map[item[key]])
        }
    })
    return result
}

export const AddDamApi = async(params: any) => {
    return await api.put('/docpal/dam/setting', params).then(res => res.data)
}
export const EditDamApi = async(params: any) => {
    return await api.post('/docpal/dam/editSetting', params).then(res => res.data)
}
export const DeleteDamApi = async(params: string[]) => {
    return await api.post('/docpal/dam/deleteSettings', params).then(res => res.data)
}
export const GetDamSupportedFormat = async() => {
    return await api.get('/docpal/dam/getSupportedFormat').then(res => res.data)
}
