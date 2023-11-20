export * from './input'
export * from './date'
export * from './user'
export * from './boolean'
export * from './file'
export const DefaultForm = ()  => ({
    widgetList:[

    ] as any[],
    formConfig: {
        "modelName": "formData",
        "refName": "vForm",
        "rulesName": "rules",
        "labelWidth": 120,
        "labelPosition": "top",
        "size": "",
        "labelAlign": "label-left-align",
        "cssCode": "",
        "customClass": [],
        "functions": "function getCookie (name) {\n  var strCookies = document.cookie;\n  var array = strCookies.split(';');\n  for (var i = 0; i < array.length; i++) {\n    var item = array[i].split(\"=\");\n    if (item[0] == name) {\n        return item[1];\n    }\n  }\n  return null;\n}\n",
        "layoutType": "PC",
        "jsonVersion": 3,
        "onFormCreated": "",
        "onFormMounted": "",
        "onFormDataChange": "",
        "saveRemoteOptions": "never",
        "labelFormUniqueName": true,
        "onFormValidate": "",
        "dataSources": []
    }
})