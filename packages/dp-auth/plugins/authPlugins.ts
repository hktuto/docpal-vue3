import { api } from 'dp-api'
import jwt_decode from "jwt-decode";
import {memoizedRefreshToken} from "~/utils/refreshToken";
let refreshing = false;
import LogoutButton from '~/components/LogoutButton.vue'
export default defineNuxtPlugin((nuxtApp) => {
  const router:any = nuxtApp.$router;
    // Doing something with nuxtApp
    // setup api for token refresh
    // @ts-ignore
    const { locale } = nuxtApp.$i18n
    api.interceptors.request.use( async(config) => {
        const token = sessionStorage.getItem('token');
        if(token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
            'Accept-Language': locale.value
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


  })
