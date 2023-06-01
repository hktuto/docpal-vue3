import { api } from 'dp-api'
import { ElMessage } from 'element-plus'
const noRouteErrorPages = ['/FormEditor/']
export default defineNuxtPlugin((nuxtApp) => {
  const router:any = nuxtApp.$router;
  const route:any = nuxtApp._route;
        api.interceptors.response.use( 
        (response) => response, 
        async(error) => {
            const config = error?.config;
            if (error?.response?.status === 401 && !config?.sent) {
                config.sent = true;
                return api(config);
            } else if ((error?.response?.status === 404 || error?.response?.status === 503) &&
                    !routeMatcher(route.path, noRouteErrorPages)) {
                router.push(`/error/${error.response.status}`)
                return
            } else if (error?.response?.status === 500) {
                messageError(error)
            }
            return Promise.reject(error);
        });
  })

function routeMatcher (path, routeList) {
    let result = false
    routeList.forEach(item => {
        if(path.indexOf(item) !== -1) result = true
    });
    return result
}
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
