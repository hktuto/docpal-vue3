import {api} from '../';
import { 
    pageParams,
    paginationData,
} from '../model';
export const AiChatInitApi = async() => {
    const res = await api.get('/ai/queryAiChatInitInfo', { }).then(res => res.data.data)
    return res
}
export const AddAiCommentApi = async(answerId) => {
    const res = await api.post('/ai/addAiComment', { answerId }).then(res => res.data.data)
    return res
}
export const AiAaskQuestionApi = async(params) => {
    const res = await api.post('/ai/askQuestion', params, {
        timeout: 2 * 60000
    }).then(res => res.data.data)
    return res
}
