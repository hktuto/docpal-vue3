
import { TABLE, defaultSetting } from '../constant/tableColumn';
import { TableColumnSetting } from '../models/TableColumnSetting';
export let columnList = <TableColumnSetting>[];
export const getTableColumnSetting = async():Promise<TableColumnSetting> => {
  const serverResponse = await api<TableColumnSetting>('/nuxeo/admin/setting/tableColumn', {method:'GET'});
  const defaultSetting = getDefaultTable()
  columnList = Object.assign(defaultSetting, serverResponse)
  return defaultSetting;
}
export const saveTableColumnSetting = async(setting:TableColumnSetting) => {
  return await api('/nuxeo/admin/setting/tableColumn', {
    methods: 'PUT',
    body: {
      setting
    }
  })
}
export type OCR_SETTING = {
  defaultOCRLanguage:string,
  supportedInputFormats: string[]
}
export const getOCRSetting = async():Promise<OCR_SETTING> => {
  return await api('/nuxeo/admin/setting/OCR', {
    methods: 'GET'
  })
}
export const getExternalEndpoint = async() => {
  const res:string = await api('/nuxeo/admin/setting/configuration', {
    methods: 'GET'
  })
  const serverResponse = JSON.parse(res)
  return serverResponse.hosts.reduce((result:any, current:any) => {
      result = Object.assign(result, current)
      return result;
  }, {})
}
type ServerLanguageResponse = {
  locale:[
      {
          code : string,
          language : string
      }
  ]
}
export const getAvailableLanguage = async() => {
  const { locale } = await api<ServerLanguageResponse>('/nuxeo/admin/setting/language', {
    methods: 'GET'
  });
  return locale
}

async function getDefaultTable() {
  const result = <TableColumnSetting>{}
  Object.values(TABLE).forEach((value) => {
      result[value] = defaultSetting[value] ?? []
  })
  return result;
}