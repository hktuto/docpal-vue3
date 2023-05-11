import {api} from '../';
import {
    pageParams, 
    paginationData
} from '../model';

export const GetAuditEventApi = async(params: pageParams):Promise<paginationData> => {
    try {
        const res = await api.post<paginationData>('/nuxeo/document/queryAuditEvent', params).then(res => res.data.data);
        return {
            entryList: res.entryList,
            // totalSize: res.totalSize
            totalSize: res.pageCount
        }
    } catch (error) {
        return {
            entryList: [],
            totalSize: 0
        }
    }
}
