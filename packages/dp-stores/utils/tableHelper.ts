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

const tableHelper = {
    trashType,
    filterArr: [
        {
            name: 'dateFormat',
            supportedType: ['date'],
            params: {
                format: 'string'
            }
        }, {
            name: 'capitalized',
            supportedType: ['string'],
        }, {
            name: 'hidePhone',
            supportedType: ['number'],
        }, {
            name: 'hideIdCard',
            supportedType: ['number'],
        },{
            name: 'hideEmail',
            supportedType: ['string'],
        },{
            name: 'regExp',
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
            ]
        },{
            name: 'concat',
            supportedType: ['array'],
            params: {
                joiner: 'string',
            },
        }, {
            name: 'i18n',
            supportedType: ['string']
        }
    ],
    ValueFilters: <any>{
        dateFormat(time:string = '', params:any){
            if(!time) return ''
            if(!params.format) params.format = 'YYYY-MM-DD HH:mm'
            return dayjs(time).format( params.format)
        },
        capitalized(str: string){
            str = str.toLowerCase();
            return str.replace(/\b(\w)|\s(\w)/g, (m) => m.toUpperCase())
        },
        hideEmail (email: string) {
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
        },
        /* 数字 */
        hidePhone(value: any) {
            if(!Number(value)) return Number(value)
            return value.replace(/^(\d{3})\d+(\d{4})$/, "$1****$2");
        },
        hideIdCard(value: any) {
            if(!Number(value)) return Number(value)
            return value.replace(/^(\d{6})\d+(\d{4})$/, "$1******$2");
        },
        regExp (value: any, params: any) {
            return value.replace(eval(params.regExp), params.format)
        },
        concat (value: any, params: any) {
            if (!params.joiner) params.joiner = ','
            return value.join(params.joiner)
        },
        i18n (value: any) {
            // return i18n.t(value)
            return value
        }
    },
    getFilterArr (metaType: metaType) {
        const result:any = []
        this.filterArr.forEach(item => {
        if(!item.supportedType || item.supportedType.includes(metaType)) {
            result.push({ label: item.name, value: item.name, ...item })
        }
        })
        return result
    },
    propListGet (typeObj: any) {
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
    },
    getPropType(row: any, prop: string) {
        let result = ''
        let nextValue = { ...row }
        prop.split('.').forEach(key => {
            result = nextValue[key]
            nextValue = nextValue[key]
        })
        return result
    },
    getFormatProp(row: any, col: any) {
        if(!col.formatList || col.formatList.length === 0) return this.getProp(row, col.prop)
        else {
            let result = ''
            col.formatList.forEach((item:any) => {
                if (item.formatFun) {
                    result += this.ValueFilters[item.formatFun](this.getProp(row, item.prop),deepCopy(item.params) )
                } else {
                    result += this.getProp(row, item.prop)
                }
            })
            return result
        }
    },
    getProp(row:any, prop: string) {
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
}
export default tableHelper

export const formatDate = (time:any, format="YYYY-MM-DD HH:mm") => {
    return dayjs(time).format(format)
}
