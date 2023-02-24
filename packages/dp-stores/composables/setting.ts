import { useDebounceFn } from "@vueuse/core";
import { TableColumnSetting } from '../models/TableColumnSetting'
import {
  getOCRSetting,
  getExternalEndpoint,
  getTableColumnSetting,
  getAvailableLanguage,
  OCR_SETTING,
  } from '../utils/settingApi'


export const useSetting = () => {
  const tableColumnSetting = useState<TableColumnSetting>('tableColumnSetting');
  const ocrSetting = useState<OCR_SETTING>('ocrSetting');
  const availableLanguage = useState('availableLanguage');
  const externalEndpoint = useState('externalEndpoint', () => ({
      admin : "admin.app4.wclsolution.com",
      docpal : "app4.wclsolution.com",
      office  : "office.app4.wclsolution.com", 
      upload : "upload.app4.wclsolution.com",
  }));
  async function init () {
    ocrSetting.value = await getOCRSetting()
    tableColumnSetting.value = await getTableColumnSetting()
    availableLanguage.value = await getAvailableLanguage()
    externalEndpoint.value = await getExternalEndpoint()
  }
  function canOCR(extension: string): boolean { 
    return ocrSetting.value.supportedInputFormats.includes(extension);
  } 
  return {
    tableColumnSetting,
    ocrSetting,
    availableLanguage,
    externalEndpoint,
    init,
    canOCR
  }
}