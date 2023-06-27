import {api} from '../';
import {
    pageParams,
    paginationResponseData
} from '../model';
export const GetMessageQueuePageApi = async(pageNum: number, pageSize: number, extraParams: pageParams):Promise<paginationResponseData> => {
    const res = await api.post(`/message/queue/page?pageNum=${pageNum}&pageSize=${pageSize}`, extraParams).then(res => res.data.data)
    return {
        entryList: res.content,
        totalSize: res.totalElements
    }
}
export const ReSubmitMessageQueueApi = async(messageId: string, businessId: string) => {
    const res = await api.post(`/message/queue/${messageId}/reSubmit?businessId=${businessId}`, {}).then(res => res.data.data)
    return res
}
