import {api} from '../';

export const getNotificationListApi = async(receiveId:string, param: any) => {

    return api.post(`/docpal/notification/page?pageNum=${param.pageNum}&pageSize=${param.pageSize}`, { receiveId }).then(res => res.data)
}

export const getUnreadNotificationNumberApi = async() => {
    return api.get('/docpal/notification/unRead/number').then(res => res.data)

}

export const subscribeListGetApi = async(userId) => {
    return api.get(`/docpal/notification/subscriber/${userId}/folders`).then(res => res.data.result)
}

export const fileSubscribeApi = async(idOrPath, subscriber) => {
    return api.post(`/docpal/notification/subscriber`,{
        idOrPath, subscriber
    }).then(res => res.data)
}

export const fileUnsubscribeApi = async(idOrPath, userId) => {
    return api.delete(`/docpal/notification/subscriber/subscriber/${userId}/idOrPath/${idOrPath}`).then(res => res.data)
}
