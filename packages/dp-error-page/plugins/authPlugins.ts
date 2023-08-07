import { api } from 'dp-api'
import { ElMessage } from 'element-plus'
const noRouteErrorPages = ['/FormEditor/', '/workflowForm/']
export default defineNuxtPlugin((nuxtApp) => {
  const router:any = nuxtApp.$router;
  const route:any = nuxtApp._route;
        api.interceptors.response.use( 
        (response) => response, 
        async(error) => {
            const config = error?.config;
            const messageErrorCode = [403, 500]
            if ((error?.response?.status === 404 || error?.response?.status === 503) &&
                    !routeMatcher(route.path, noRouteErrorPages)) {
                router.push(`/error/${error.response.status}`)
                return
            } else if (messageErrorCode.includes(error?.response?.status)) {
                messageError(error, { router, route })
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
 * if need browseErrorHandle, add params: { headers: { browseErrorHandle: 'true' } }
 */
function messageError (error: any, { router, route }) {
    if (error.config.headers.noThrowError) return
    else if (error.config.headers.browseErrorHandle) {
        browseErrorHandle(error.response.data.code, { router, route })
        return
    }
    // @ts-ignore
    const message = error.response?.data?.message ? error.response.data.message : $i18n.t('responseMsg_errorCode_2')
    ElMessage.error(message)
}
function browseErrorHandle(code, { router, route }) {
    router.push(`/browse/error?code=${code}&path=${route.query.path}`)
}
