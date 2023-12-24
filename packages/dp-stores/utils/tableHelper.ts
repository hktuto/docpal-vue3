import dayjs from 'dayjs'
export type metaType = 'string' | 'date' | 'boolean' | 'number' | 'array'
const trashType = {
  id: 'string',
  name: 'string',
  description: 'string',
  path: 'string',
  type: 'string',
  version: 'string',
  createdBy: 'string',
  createdDate: 'date',
  modifiedDate: 'date',
  isFolder: 'boolean',
  isCheckedOut: 'boolean',
  properties: {
    "uid:uid": 'string',
    "uid:major_version": 'number',
    "uid:minor_version": 'number',
    "trashed_date": 'date',
    "principalName": 'string'
  },
  parentRef: 'string',
  logicalPath: 'string'
}
export const useTableHelper = () => {
    const { $i18n: {t} } = useNuxtApp()
    const tableClassList = [
        'tag', 'success-tag', 'info-tag', 'warning-tag', 'danger-tag', 
        'round'
    ]
    const tableFilters = <any>{
        dateFormat: {
            supportedType: ['date'],
            params: {
                format: 'string'
            },
            fun(time:string = '', params:any){
                if(!time) return '-'
                if(!params.format) params.format = 'YYYY-MM-DD HH:mm'
                return dayjs(time).format( params.format)
            }
        },
        capitalized: {
            supportedType: ['string'],
            fun(str: string){
                str = str.toLowerCase();
                return str.replace(/\b(\w)|\s(\w)/g, (m) => m.toUpperCase())
            }
        },
        hideEmail: {
            supportedType: ['string'],
            fun(email: string) {
                if (String (email).indexOf ('@') > 0) {
                    let newEmail, str = email.split('@'), _s = '';
            
                    if (str[0].length > 4) {
                        _s = str[0].substr (0, 4);
                        for (let i = 0; i < str[0].length - 4; i++) {
                            _s += '*';
                        }
                    } else {
                        _s = str[0].substr (0, 1);
                        for (let i = 0; i < str[0].length - 1; i++) {
                            _s += '*';
                        }
                    }
                    newEmail = _s + '@' + str[1];
                    return newEmail;
                } else {
                    return email;
                }
            }
        },
        hidePhone: {
            name: 'hidePhone',
            supportedType: ['number'],
            fun(value: any) {
                if(!Number(value)) return Number(value)
                return value.replace(/^(\d{3})\d+(\d{4})$/, "$1****$2");
            }
        },
        hideIdCard: {
            supportedType: ['number'],
            fun(value: any) {
                if(!Number(value)) return Number(value)
                return value.replace(/^(\d{6})\d+(\d{4})$/, "$1******$2");
            }
        },
        regExp: {
            params: {
                regExp: 'string',
                format: 'string'
            },
            example: [
                {
                regExp: '/^(\\d{6})\\d+(\\d{4})$/',
                format: '$1******$2',
                description: 'regExp.description.hideIdCard'
                }
            ],
            fun(value: any, params: any) {
                return value.replace(eval(params.regExp), params.format)
            }
        },
        concat: {
            supportedType: ['array'],
            params: {
                joiner: 'string',
            },
            fun(value: any, params: any) {
                if (!params.joiner) params.joiner = ','
                return value.join(params.joiner)
            }
        },
        i18n: {
            supportedType: ['string'],
            fun(value:any){
                return t(value)
            }
        },
        duration: {
            supportedType: ['date'],
            params: {
                date: 'string',
            },
            fun(value:any, params: any){
                const date = getProp(params.row, params.date)
                if(!value || !date) return ''
                return dayjs(value).diff(date, 'day') + t('common_days')
            }
        },
        fileSize: {
            supportedType: ['string','number'],
            params: {
            },
            fun(value:any){
                if(!value) return '-'
                const a = 1024;
                const sizeList = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
                if (value < a) return `${value}${sizeList[0]}`;
                let getLoga = (a: any, n: any) => {
                    // a的x次方=n x=n的对数（x以a为底数 N的对数）
                    // 下面的函数返回以 a 为底 n 的对数（即 loga n）
                    return Math.floor(Math.log(n) / Math.log(a));
                }

                let logaN = getLoga(a, value);
                let size = (value / Math.pow(a, logaN)).toFixed(2);
                return `${size}${sizeList[logaN]}`;
            }
        },
        unit: {
            params: {
                unit: 'string',
            },
            fun(value:any, params: any){
                return value + params.unit
            }
        },
    }
    function getFilters () {
        return Object.keys(tableFilters).reduce((prev:any,key:any) => {
            prev[key] = tableFilters[key].fun
            return prev
        }, {})
    }
    const formatFuns:any = getFilters()
    function getTableFilters (metaType: metaType) {
        const result:any = []
        Object.keys(tableFilters).forEach((key: string) => {
            const item = tableFilters[key]
            if(!item.supportedType || item.supportedType.includes(metaType)) {
                result.push({ label: key, value: key, ...item })
            }
        })
        return result
    }
    function propListGet (typeObj: any) {
        const result:any = []
        recursion(typeObj)
        return result
        function recursion(obj:any, prefix = '') {
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'object') {
            prefix += key + '.'
            recursion(obj[key], prefix)
            }
            else result.push({value: prefix + key, label: prefix + key})
        })
        }
    }
    function getPropType(row: any, prop: string) {
        let result = ''
        let nextValue = { ...row }
        prop.split('.').forEach(key => {
            result = nextValue[key]
            nextValue = nextValue[key]
        })
        return result
    }
    function getFormatProp(row: any, col: any) {
        const _row = deepCopy(row)
        const _col = deepCopy(col)
        if(!_col.formatList || _col.formatList.length === 0) return getProp(_row, _col.prop)
        else {
            const result = _col.formatList.reduce((prev: string, item:any) => {
                if (item.joiner) { // 连接符
                    prev = prev + item.joiner
                } else if (item.formatFun) {
                    item.params.row = _row
                    const value = getProp(_row, item.prop)
                    prev = prev + formatFuns[item.formatFun](value, deepCopy(item.params) )
                } else if (item.prop) {
                    prev = prev + getProp(_row, item.prop)
                } 
                return prev
            }, '')
            return result
        }
    }
    function getProp(row:any, prop: string) {
        try {
            let result = ''
            let nextValue = { ...row }
            prop.split('.').forEach(key => {
                result = nextValue[key]
                nextValue = nextValue[key]
            })
            return result
        } catch (error) {
            return ''
        }
    }
    return {
        tableClassList,
        trashType,
        tableFilters,
        getTableFilters,
        propListGet,
        getPropType,
        getFormatProp,
        getProp
    }
}
export default useTableHelper

export const formatDate = (time:any, format="YYYY-MM-DD HH:mm") => {
    if (!time) return '-'
    return dayjs(time).format(format)
}
const today = new Date();
type dayjsUnit = 'day'| 'minute'
export const diffMinute = (date1:string | Date = today, date2:string | Date = today, unit:dayjsUnit = 'minute') => {
    return dayjs(date1).diff(date2, unit)
}
