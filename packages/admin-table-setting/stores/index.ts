import dayjs from 'dayjs'
export type metaType = 'string' | 'date' | 'boolean' | 'number'
export const trashType = {
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
function typeGet (typeObj) {
  const result = {}
  recursion(typeObj)
  return result
  function recursion(obj, prefix = '') {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object') {
        prefix += key + '.'
        recursion(obj[key], prefix)
      }
      else result[prefix + key] = obj[key]
    })
  }
}
export function propListGet (typeObj) {
  const result = []
  recursion(typeObj)
  return result
  function recursion(obj, prefix = '') {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object') {
        prefix += key + '.'
        recursion(obj[key], prefix)
      }
      else result.push({value: prefix + key, label: prefix + key})
    })
  }
}
export function getPropType(row, prop) {
  let result = ''
  let nextValue = { ...row }
  prop.split('.').forEach(key => {
      result = nextValue[key]
      nextValue = nextValue[key]
  })
  return result
}
export function getFilterArr (metaType: metaType) {
  const result = []
  filterArr.forEach(item => {
    if(!item.supportedType || item.supportedType.includes(metaType)) {
      result.push({ lable: item.name, value: item.name, ...item })
    }
  })
  return result
}
export const filterArr = [
  {
    name: 'dateFormat',
    supportedType: ['date'],
    params: {
      format: 'string'
    }
  }, {
    name: 'capitalized',
    supportedType: ['number', 'string'],
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
  }
]


const ValueFilters = {
    dateFormat(time, params){
        if(!time) return ''
        if(time.length <= 10) {
            return dayjs.unix(time.format(params.format ?? 'YYYY-MM-DD'))
        } else {
            return dayjs(time.format(params.format ?? 'YYYY-MM-DD'))
        }
    },
    capitalized(str){
        str = str.toLowerCase();
        return str.replace(/\b(\w)|\s(\w)/g, (m) => m.toUpperCase())
    },
    hideEmail (email) {
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
    hidePhone(value) {
        if(!Number(value)) return Number(value)
        return value.replace(/^(\d{3})\d+(\d{4})$/, "$1****$2");
    },
    hideIdCard(value) {
        if(!Number(value)) return Number(value)
        return value.replace(/^(\d{6})\d+(\d{4})$/, "$1******$2");
    },
    regExp (value, params) {
        return value.replace(eval(params.regExp), params.format)
    }
}

export default ValueFilters
