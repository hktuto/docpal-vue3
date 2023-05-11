import {api} from '../';
import {
    pageParams,
    paginationResponseData
} from '../model';
export const GetMessageQueuePageApi = async(pageNum: number, pageSize: number, extraParams: pageParams):Promise<paginationResponseData> => {
    const res = await api.post(`/message/queue/page?pageNum=${pageNum}&pageSize=${pageSize}`, extraParams).then(res => res.data)
    return {
        entryList: res.result.content,
        totalSize: res.result.totalElements
    }
}
export const ReSubmitMessageQueueApi = async(messageId: string) => {
    const res = await api.post(`/message/queue/${messageId}/reSubmit`, {}).then(res => res.data)
    return res
}
