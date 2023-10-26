import { useDebounceFn } from "@vueuse/core";
import { TableColumnSetting } from '../models/TableColumnSetting'
import {
  GetOCRSetting,
  GetExternalEndpoint,
  GetTableColumnSetting,
  GetAvailableLanguage,
  } from 'dp-api'
import { OCR_SETTING } from 'dp-api/src/model/setting'

export const useSetting = () => {
  const isLdapMode = false
  const tableColumnSetting = useState<TableColumnSetting>('tableColumnSetting');
  const ocrSetting = useState<OCR_SETTING>('ocrSetting');
  const availableLanguage = useState('availableLanguage');
  const externalEndpoint = useState('externalEndpoint', () => ({
      admin : "admin.app4.wclsolution.com",
      docpal : "app4.wclsolution.com",
      office  : "office.app4.wclsolution.com", 
      upload : "upload.app4.wclsolution.com",
      dashboard : "https://app4.wclsolution.com/public-api/report/v1/api",
  }));
  async function init () {
    ocrSetting.value = await GetOCRSetting()
    tableColumnSetting.value = await GetTableColumnSetting()
    availableLanguage.value = await GetAvailableLanguage()
    externalEndpoint.value = await GetExternalEndpoint()
  }
  function canOCR(extension: string): boolean { 
    return ocrSetting.value.supportedInputFormats.includes(extension);
  } 
  return {
    isLdapMode,
    tableColumnSetting,
    ocrSetting,
    availableLanguage,
    externalEndpoint,
    init,
    canOCR
  }
}