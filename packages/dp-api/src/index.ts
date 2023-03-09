import axios from 'axios';

export const api = axios.create({
    baseURL: '/api',
})

export * from './endpoint';
export * from './model';
export * from './json';
