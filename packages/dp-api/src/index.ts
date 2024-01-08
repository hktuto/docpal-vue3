import axios from 'axios';
import axiosTauriApiAdapter from './tauri';

import tableSettingJson from "./table/setting.json";
export const api = axios.create({
    baseURL: 'https://app4.wclsolution.com/api', //TODO : set base url from env
    timeout: 50000,
})

export * from './endpoint';
export * from './model';
export * from './json';
export { tableSettingJson }
