import { api } from 'dp-api'
import jwt_decode from "jwt-decode";
import {refreshTokenFn} from "~/utils/refreshToken";
import { ElMessage } from 'element-plus'
const noRouteErrorPages = ['/FormEditor/', '/workflowForm/']
export default defineNuxtPlugin((nuxtApp) => {
    const { logout } = useUser()
    const router:any = nuxtApp.$router;
  const route:any = nuxtApp._route;
    // Doing something with nuxtApp
    // setup api for token refresh
    // @ts-ignore
    const { locale } = nuxtApp.$i18n
    api.interceptors.request.use( async(config) => {
        config.headers = {
            'Accept-Language': locale.value,
            ...config.headers,
        }  
        const token = localStorage.getItem('token');
        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        } 
        return config;
    },(error) => Promise.reject(error));
    api.interceptors.response.use((response) => response, async(error) => {
        const config = error?.config;
        const messageErrorCode = [403, 500]
        if (error?.response?.status === 401 && !config?.sent) {
            console.log('401, retrying with new token', error?.response?.status, config?.sent)
            config.sent = true;
            const result = await memoizedRefreshToken();
            if (result?.access_token) {
                config.headers = {
                    ...config.headers,
                    authorization: `Bearer ${result?.access_token}`,
                };
            }
            localStorage.setItem('token', result?.access_token)
            return api(config);
        }
        if ((error?.response?.status === 404 || error?.response?.status === 503) &&
                    !routeMatcher(route.path, noRouteErrorPages)) {
                router.push(`/error/${error.response.status}`)
                return
            } else if (messageErrorCode.includes(error?.response?.status)) {
                messageError(error, { router, route })
                if(error?.response?.status === 403 ) {
                    console.log('403, logout', error?.response?.status, config?.sent)
                    config.sent = false;
                    logout();
                    return Promise.resolve();
                }
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
