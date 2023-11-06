// @ts-nocheck
import axios from 'axios';
import { api } from 'dp-api'
import jwt_decode from "jwt-decode";
import {refreshTokenFn} from "~/utils/refreshToken";
import { ElMessage } from 'element-plus'
const noRouteErrorPages = ['/FormEditor/', '/workflowForm/', '/workflowEditor/']
const cancelAxiosWhiteList = [
    // admin-acl
    // '/nuxeo/document/children/thumbnail',
    // '/nuxeo/document',
    // public
    '/nuxeo/document/download',
    '/nuxeo/document/isDuplicateName',
    '/nuxeo/document/createDocument',
    '/nuxeo/document/createFolders',
    '/docpal/relation/queryLanguage',
    '/docpal/notification/page',
    '/docpal/notification/unRead/number',
    // setting
    '/auth/nuxeo/token',
    '/nuxeo/admin/setting/tableColumn',
    '/nuxeo/admin/setting/language',
    // export
    '/docpal/cabinet/export',
    '/nuxeo/search/exportCsv',
    '/docpal/workflow/tasks/exportTasksUser',
    '/docpal/workflow/history/exportProcessHistory',
    // search
    '/nuxeo/collection/all',
    '/nuxeo/tags/getAllTags',
    '/nuxeo/types',
    '/nuxeo/search/textSearchTypes',
    '/nuxeo/identity/users',
    '/nuxeo/search/getSearchExtends',
    // workflow
    '/docpal/workflow/process/list',
    '/docpal/workflow/process/model',
]
let flag = 0
export default defineNuxtPlugin((nuxtApp) => {
    const { logout } = useUser()
    const router:any = nuxtApp.$router;
    const route:any = nuxtApp._route;
    // Doing something with nuxtApp
    // setup api for token refresh
    const { locale } = nuxtApp.$i18n
    api.interceptors.request.use( async(config) => {
        if(process.env.NODE_ENV !== 'development') {
            config.baseURL = getBaseUrl(config.baseURL)
            config.headers['Access-Control-Allow-Credentials'] = true
            config.headers['Access-Control-Allow-Origin'] = config.baseURL
        }
        config.headers = {
            'Accept-Language': locale.value,
            ...config.headers,
        }
        const token = localStorage.getItem('token');
        config.headers.Authorization = `Bearer ${token}`
        if(!config.headers.white && cancelAxiosWhiteList.every(item => !config.url.includes(item))) {
            if(!window.canCancelAxios) window.canCancelAxios = []
            config.cancelToken = new axios.CancelToken(function (c: any) { window.canCancelAxios.push({ key: config.headers.key || "", cancel: c }) });
        }
        return config;
    },(error) => Promise.reject(error));
    api.interceptors.response.use((response) => response, async(error) => {
        const config = error?.config;
        const messageErrorCode = [403, 500]
        if (error?.response?.status === 401 && !config?.sent) {
            console.log('401, retrying with new token', error?.response?.status, config?.sent)
            config.sent = true;
            const result = await refreshTokenFn();
            if (result?.access_token) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${result?.access_token}`,
                };
            }
            setTimeout(() => {
                config.sent = false
            }, 30000)
            localStorage.setItem('token', result?.access_token)
            return api(config);
        }
        if ((error?.response?.status === 404 || error?.response?.status === 503) &&
                    !routeMatcher(route.path, noRouteErrorPages)) {
                router.push(`/error/${error.response.status}`)
                return
            } else if (messageErrorCode.includes(error?.response?.status)) {

                if(error?.response?.status === 403 ) {
                    messageError(error, { router, route })
                    config.sent = false;
                    logout();
                    return Promise.resolve();
                }
                messageError(error, { router, route })
            }


        return Promise.reject(error);
    });
})
function getBaseUrl(baseURL) {
    const { public:{ DASHBOARD_PROXY } } = useRuntimeConfig();
    if(baseURL === '/dashboard') return DASHBOARD_PROXY
    return baseURL
}
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
