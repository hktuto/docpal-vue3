import axios from 'axios';

import tableSettingJson from "./table/setting.json";
export const api = axios.create({
    baseURL: window.__NUXT__.config.public.CUSTOM_KEYCLOAK_REDIRECT ? window.__NUXT__.config.public.CLIENT_PROXY : "/api", 
    timeout: 50000,
})

export * from './endpoint';
export * from './model';
export * from './json';
export { tableSettingJson }
