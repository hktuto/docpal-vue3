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
  const { pubic } = useRuntimeConfig()
  const externalEndpoint = useState('externalEndpoint', () => ({
      admin : pubic.ADMIN_END_POINT,
      docpal : pubic.DOCPAL_END_POINT,
      office  : pubic.OFFICE_END_POINT,
      upload : pubic.UPLOAD_END_POINT,
      dashboard : pubic.DASHBOARD_PROXY,
  }));
  async function init () {
    ocrSetting.value = await GetOCRSetting()
    tableColumnSetting.value = await GetTableColumnSetting()
    availableLanguage.value = await GetAvailableLanguage()
    // externalEndpoint.value = await GetExternalEndpoint()
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
