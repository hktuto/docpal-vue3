import axios from 'axios';
import axiosTauriApiAdapter from './tauri';

import tableSettingJson from "./table/setting.json";
export const api = axios.create({
    baseURL: '/api',
    timeout: 50000,
    adapter: (config) => {
        if(window?.__TAURI__){
            // config.baseURL = undefined
            if(config.baseURL === '/api'){
                console.log(config)
                config.baseURL = undefined
                config.url = 'https://app4.wclsolution.com/api' + config.url;
            }
            return axiosTauriApiAdapter(config);
        }
        return axios(Object.assign({}, config, { adapter: undefined }));
    }
})

export * from './endpoint';
export * from './model';
export * from './json';
export { tableSettingJson }
