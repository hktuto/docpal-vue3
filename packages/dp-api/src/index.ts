import axios from 'axios';
import tableSettingJson from "./table/setting.json";

export const api = axios.create({
    baseURL: '/api',
})

export * from './endpoint';
export * from './model';
export * from './json';
export { tableSettingJson }
