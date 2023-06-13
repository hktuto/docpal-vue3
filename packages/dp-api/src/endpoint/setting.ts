
import { api } from '../'
import {Response} from '../model';
import { TABLE, TableColumnSetting, defaultTableSetting } from '../model/Table';
import { OCR_SETTING, ServerLanguageResponse,  } from '../model/setting';


export const GetTableColumnSetting = async():Promise<TableColumnSetting> => {
    const serverResponse = await api.get<TableColumnSetting>('/nuxeo/admin/setting/tableColumn').then((res:any) => res.data.data);
    const defaultTableSetting = GetDefaultTable()
    return Object.assign(defaultTableSetting, serverResponse);
  }

  export const GetDefaultTable = ():TableColumnSetting => {
    const result : any = {}
    Object.values(TABLE).forEach((value:any) => {
        result[value] = defaultTableSetting[value] ?? []
    })
    return result;
  }

  export const SaveTableColumnSetting = async(setting:TableColumnSetting) => {
    return await api.put('/nuxeo/admin/setting/tableColumn', {
        setting
      }).then(res => res.data.data)
  }

  export const GetOCRSetting = async():Promise<OCR_SETTING> => {
    return await api.get('/nuxeo/admin/setting/OCR').then((res:any) => res.data.data)
  }

  export const GetExternalEndpoint = async() => {
    const res = await api.get('/nuxeo/admin/setting/configuration').then(res => res.data.data)
    return res.hosts.reduce((result:any, current:any) => {
        result = Object.assign(result, current)
        return result;
    }, {})
  }

  export const GetAvailableLanguage = async():Promise<[{
        code: string;
        language: string;
    }]> => {
    const { locale } = await api.get<ServerLanguageResponse>('/nuxeo/admin/setting/language').then((res:any) => JSON.parse(res.data.data));
    return locale
  }

// # get OCR setting
export const getOcrSupportedLanguage = () => {
  return api.get('/nuxeo/ocr/supportedLanguage').then(res => res.data.data.languages);
}