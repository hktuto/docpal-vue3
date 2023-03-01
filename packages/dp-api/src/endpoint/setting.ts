
import { api } from '../'
import { TABLE, TableColumnSetting, defaultSetting } from '../model/Table';
import { OCR_SETTING, ServerLanguageResponse } from '../model/setting';


export const GetTableColumnSetting = async():Promise<TableColumnSetting> => {
    const serverResponse = await api.get<TableColumnSetting>('/nuxeo/admin/setting/tableColumn').then(res => res.data);
    const defaultSetting = GetDefaultTable()
    return Object.assign(defaultSetting, serverResponse);
  }

  export const GetDefaultTable = ():TableColumnSetting => {
    const result : TableColumnSetting = {}
    Object.values(TABLE).forEach((value) => {
        result[value] = defaultSetting[value] ?? []
    })
    return result;
  }

  export const SaveTableColumnSetting = async(setting:TableColumnSetting) => {
    return await api.put('/nuxeo/admin/setting/tableColumn', {
        setting
      }).then(res => res.data)
  }

  export const GetOCRSetting = async():Promise<OCR_SETTING> => {
    return await api.get('/nuxeo/admin/setting/OCR').then(res => res.data)
  }

  export const GetExternalEndpoint = async() => {
    const res = await api.get('/nuxeo/admin/setting/configuration').then(res => res.data)
    return res.hosts.reduce((result:any, current:any) => {
        result = Object.assign(result, current)
        return result;
    }, {})
  }

  export const GetAvailableLanguage = async():Promise<[{
        code: string;
        language: string;
    }]> => {
    const { locale } = await api.get<ServerLanguageResponse>('/nuxeo/admin/setting/language').then(res => res.data);
    return locale
  }