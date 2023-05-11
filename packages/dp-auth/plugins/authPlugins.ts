import { api } from 'dp-api'
import jwt_decode from "jwt-decode";


let refreshing = false;
export default defineNuxtPlugin((nuxtApp) => {
  const router:any = nuxtApp.$router;
    // Doing something with nuxtApp
    // setup api for token refresh
    api.interceptors.request.use( async(config) => {
        const token = sessionStorage.getItem('token');
        if(token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          }
        }
        return config;
    },(error) => Promise.reject(error));
    api.interceptors.response.use( 
      (response) => response, 
      async(error) => {
        const config = error?.config;
        if (error?.response?.status === 401 && !config?.sent) {
          config.sent = true;
          const result = await memoizedRefreshToken();
          if (result?.access_token) {
            config.headers = {
              ...config.headers,
              authorization: `Bearer ${result?.access_token}`,
            };
          }
          return api(config);
        }
        return Promise.reject(error);
      });
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