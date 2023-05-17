import { api } from 'dp-api'
import { ElMessage } from 'element-plus'

export default defineNuxtPlugin((nuxtApp) => {
  const router:any = nuxtApp.$router;
    api.interceptors.response.use( 
      (response) => response, 
      async(error) => {
        const config = error?.config;
        if (error?.response?.status === 401 && !config?.sent) {
          config.sent = true;
          return api(config);
        } else if (error?.response?.status === 500) {
          messageError(error)
        }
        return Promise.reject(error);
      });
  })
/**
 * 
 * @param error 
 * @returns 
 * if no noThrowError, add params: { headers: { noThrowError: 'true' } }
 */
function messageError (error: any) {
  if (error.config.headers.noThrowError) return
  // @ts-ignore
  const message = error.response?.data?.message ? error.response.data.message : $i18n.t('responseMsg_errorCode_2')
  ElMessage.error(message)
}
