import axios from 'axios';
import tableSettingJson from "./table/setting.json";

export const api = axios.create({
    baseURL: '/api',
    timeout: 50000,
})

export * from './endpoint';
export * from './model';
// export * from './json'; // disable because of the error: "Cannot find module './json'"
export { tableSettingJson }
