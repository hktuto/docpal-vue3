import {api} from '../';

export const getNotificationListApi = async(receiveId:string, param: any) => {

    return api.post(`/docpal/notification/page?pageNum=${param.pageNum}&pageSize=${param.pageSize}`, { receiveId }).then(res => res.data)
}

export const getUnreadNotificationNumberApi = async() => {
    return api.get('/docpal/notification/unRead/number').then(res => res.data)

}