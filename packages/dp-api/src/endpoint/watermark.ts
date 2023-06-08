import {api} from '../';
export type WatermarkTemplate = {
    id:string,
    name: string
}
export type WatermarkParams = {
    watermarkTemplateId: string,
    documentId: string
}
import {  } from '../model';
export const getWatermarkTemplates = async(): Promise<WatermarkTemplate[]> => {
    const data = await api.get("/docpal/watermark/templates/all/").then(res => res.data)
    return data.data ? data.data : data.result;
}
export const GetWatermarkDocPreview = async(params:WatermarkParams) => {
    return api.get('/docpal/watermark/document/preview', {
        params,
        responseType: 'blob',
        timeout: 0
    }).then(res => res.data)
}
