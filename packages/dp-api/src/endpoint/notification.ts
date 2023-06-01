import {api} from '../';
export type notificationStatus = 'CREATE' | 'READED'
export const getNotificationListApi = async(receiveId:string, param: any) => {

    return api.post(`/docpal/notification/page?pageNum=${param.pageNum}&pageSize=${param.pageSize}`, { receiveId }).then(res => res.data.data)
}

export const getUnreadNotificationNumberApi = async() => {
    return api.get('/docpal/notification/unRead/number').then(res => res.data.data)

}

export const subscribeListGetApi = async(userId) => {
    return api.get(`/docpal/notification/subscriber/${userId}/folders`).then(res => res.data.data)
}

export const fileSubscribeApi = async(idOrPath, subscriber) => {
    return api.post(`/docpal/notification/subscriber`,{
        idOrPath, subscriber
    }).then(res => res.data.data)
}

export const fileUnsubscribeApi = async(idOrPath, userId) => {
    return api.delete(`/docpal/notification/subscriber/subscriber/${userId}/idOrPath/${idOrPath}`).then(res => res.data.data)
}
export const notiDeleteApi = async(ids: string[]) => {
    return api.delete(`/docpal/notification`, { data: { ids } }).then(res => res.data.data)
}
export const notiReadAllApi = async() => {
    return api.post("/docpal/notification/read/all").then(res => res.data.data)
}
export const notiStatusSetApi = async(id, status:notificationStatus = 'READED') => {
    return api.put(`/docpal/notification/${id}/status/${status}`).then(res => res.data.data)
}
