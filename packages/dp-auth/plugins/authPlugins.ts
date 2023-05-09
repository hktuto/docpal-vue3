import { api } from 'dp-api'
import jwt_decode from "jwt-decode";


let refreshing = false;
export default defineNuxtPlugin((nuxtApp) => {
  const router:any = nuxtApp.$router;
    // Doing something with nuxtApp
    // setup api for token refresh
    // api.interceptors.request.use( async(config) => {
    //     if(!config?.headers?.Authorization) return config;

    //     const token = config.headers.Authorization.split(" ")[1];
    //     if(refreshing){
    //         return config;
    //     }
    //     const { exp } = jwt_decode(token) as any;
    //     const tokenTime = (exp * 1000) - 30000;
    //     const refreshToken = localStorage.getItem('refreshToken');
    //     if(Date.now() > tokenTime  && !refreshing && refreshToken) {
    //         refreshing = true;
    //         try{
    //             refreshing = false;
    //             const {access_token, refresh_token} = await api.post('/auth/nuxeo/token',{},{
    //                 headers:{
    //                     Authorization : 'Bearer ' + refreshToken
    //                 }
    //             }).then( res => res.data);
    //             config.headers.Authorization = 'Bearer ' + access_token
    //             localStorage.setItem('refreshToken', refresh_token);
    //             if(sessionStorage){
    //                 sessionStorage.setItem('token', access_token);
    //             };
    //             refreshing = false;
    //             return config;
    //         }catch(error){
    //             refreshing = false;
    //             if(sessionStorage){
    //                 sessionStorage.removeItem('token');
    //             };
    //             localStorage.removeItem('refreshToken');
    //             window.open(window.location.pathname, '_self');

    //         }
    //     }

    // })

    // // setup api for error handling
    // api.interceptors.response.use( async(response) => {
    //     return response;
    // }, async(error) => {
    //     refreshing = true;
    //     dpLog("api error", error);
    //     const code = parseInt(error.response && error.response.status);
    //     dpLog(code);
    //     if(code === 405 || code === 503) {
    //         const message = error.response?.data?.code || ""
    //         router.replace(`/error/${code}?message=${message}`);
    //         refreshing = false;
    //         return Promise.reject(error) 
    //     }else if(code === 401) {
    //         //get header token 
    //         const token = localStorage.getItem('refreshToken');
    //         dpLog("token", token)
    //         if(token) {
    //             try{

    //                 const {access_token, refresh_token} = await api.post('/auth/nuxeo/token',{},{
    //                     headers:{
    //                         Authorization : 'Bearer ' + token
    //                     }
    //                 }).then( res => res.data);
    //                 console.log()
    //                 error.config.headers.Authorization = 'Bearer ' + access_token
    //                 localStorage.setItem('refreshToken', refresh_token);
    //                 if(sessionStorage){
    //                     sessionStorage.setItem('token', access_token);
    //                 };
    //                 return await api.request(error.config);
    //             } catch {
    //                 if(sessionStorage){
    //                     sessionStorage.removeItem('token');
    //                 };
    //                 localStorage.removeItem('refreshToken');
    //                 return Promise.reject(error)
    //             }
    //         } else {
    //             return Promise.reject(error);
    //         }
    //     } else if (code === 403) {
    //         if(!window.location.href.includes('/2fa') ) {
    //             api.defaults.headers.common['Authorization'] = "";
    //             if(sessionStorage){
    //                 sessionStorage.removeItem('token');
    //             };
    //             localStorage.removeItem('refreshToken');
    //         }
    //         Promise.reject(error);
    //     }
    //     return Promise.reject(error);
    // });
  })