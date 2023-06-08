import {api} from '../';
export const logKey = 'ROOT'
export type logParams = {
    service?: string,
    logger?: string,
    level?: string
  }
export const getLoggersApi = async() => {
    const res = await api.get('/docpal/management/loggers').then(res => res.data.data)
    return Object.keys(res).reduce((prev, key) => {
        prev.push({
          service: key, 
          levels: res[key].levels, 
          effectiveLevel: res[key].loggers[logKey].effectiveLevel,
          configuredLevel: res[key].loggers[logKey].configuredLevel,
          loading: false
        })
        return prev
      }, []);
}
export const setLoggersApi = async(params: logParams) => {
    return api.post('/docpal/management/loggers', {}, { params }).then(res => res.data.data)
}
