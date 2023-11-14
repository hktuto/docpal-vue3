
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


export const SingleInputField = () => ({
    "key": 0,
    "type": "input",
    "icon": "text-field",
    "formItemFlag": true,
    "options": {
        "name": "name",
        "label": "Label",
        "labelAlign": "",
        "type": "text",
        "defaultValue": "",
        "placeholder": "",
        "columnWidth": "200px",
        "size": "",
        "labelWidth": null,
        "labelHidden": false,
        "readonly": false,
        "disabled": false,
        "hidden": false,
        "clearable": true,
        "showPassword": false,
        "required": false,
        "requiredHint": "",
        "validation": "",
        "validationHint": "",
        "customClass": [],
        "labelIconClass": null,
        "labelIconPosition": "rear",
        "labelTooltip": null,
        "minLength": null,
        "maxLength": null,
        "showWordLimit": false,
        "prefixIcon": "",
        "suffixIcon": "",
        "appendButton": false,
        "appendButtonDisabled": false,
        "buttonIcon": "custom-search",
        "onCreated": "",
        "onMounted": "",
        "onInput": "",
        "onChange": "",
        "onFocus": "",
        "onBlur": "",
        "onValidate": "",
        "onAppendButtonClick": ""
    },
    "id": 'form_'
})


export const CurrentUserInputField = () => {
    return {
        "type": "input",
        "icon": "text-field",
        "formItemFlag": true,
        "options": {
            "name": "user_creator_id",
            "label": "user_creator_id",
            "labelZh": "",
            "labelAlign": "",
            "type": "text",
            "defaultValue": "",
            "placeholder": "",
            "columnWidth": "200px",
            "size": "",
            "labelWidth": null,
            "labelHidden": false,
            "readonly": false,
            "disabled": false,
            "hidden": true,
            "clearable": true,
            "showPassword": false,
            "required": false,
            "requiredHint": "",
            "validation": "",
            "validationHint": "",
            "customClass": [],
            "labelIconClass": null,
            "labelIconPosition": "rear",
            "labelTooltip": null,
            "minLength": null,
            "maxLength": null,
            "showWordLimit": false,
            "prefixIcon": "",
            "suffixIcon": "",
            "appendButton": false,
            "appendButtonDisabled": false,
            "buttonIcon": "el-icon-search",
            "onCreated": "",
            "onMounted": "const user = $getCookie('docpal-user');\nthis.setValue(user.id||user.username)\n",
            "onInput": "",
            "onChange": "",
            "onFocus": "",
            "onBlur": "",
            "onValidate": ""
        },
        "id": "input113522"
    }
    
}

export const GetApproveUserList = (processKey:string,taskDefinitionKey:string) => {
    return "this.loadOptions([])\n$api.post('/docpal/workflow/task/candidatesByTaskDefinitionKey?taskDefinitionKey="+ taskDefinitionKey +"&processKey=" +   processKey + "', {}, { baseURL: '/client'}).then(res => {\n   res = res.data.data\n  const reponse = res.map(item => ({\n    value: item.userId,\n    label: `${item.username}<${item.email}>`\n  }))\n  this.loadOptions(reponse)\n}).catch(err => {\n})"
}

export const SelectInputField = () => ({
    "key": Date.now(),
    "type": "select",
    "icon": "select-field",
    "formItemFlag": true,
    "options": {
        "name": "name",
        "label": "label",
        "labelAlign": "",
        "defaultValue": [],
        "placeholder": "",
        "columnWidth": "200px",
        "size": "",
        "labelWidth": null,
        "labelHidden": false,
        "clearable": true,
        "filterable": true,
        "allowCreate": false,
        "remote": false,
        "automaticDropdown": false,
        "multiple": true,
        "multipleLimit": 0,
        "optionItems": [],
        "readonly": false,
        "disabled": false,
        "hidden": false,
        "required": false,
        "requiredHint": "",
        "validation": "",
        "validationHint": "",
        "customClass": [],
        "labelIconClass": null,
        "labelIconPosition": "rear",
        "labelTooltip": null,
        "onCreated": "",
        "onMounted": "",
        "onRemoteQuery": "",
        "onChange": "",
        "onFocus": "",
        "onBlur": "",
        "onValidate": ""
    },
    "id": "select26617"
})
export const MultiLineInputField = () => {
    const field = SingleInputField()
    field.type = 'textarea'
    field.icon = 'textarea-field'
    return field
}
export const BooleanField =() => ({
    "key": 63295,
    "type": "switch",
    "icon": "switch-field",
    "formItemFlag": true,
    "options": {
        "name": "switch22448",
        "label": "switch",
        "labelAlign": "",
        "defaultValue": false,
        "columnWidth": "200px",
        "labelWidth": null,
        "labelHidden": false,
        "disabled": false,
        "hidden": false,
        "customClass": [],
        "labelIconClass": null,
        "labelIconPosition": "rear",
        "labelTooltip": null,
        "switchWidth": 40,
        "activeText": "",
        "inactiveText": "",
        "activeColor": null,
        "inactiveColor": null,
        "onCreated": "",
        "onMounted": "",
        "onChange": "",
        "onValidate": ""
    },
    "id": "switch22448"
})
export const DateInputField = () => {
    return {
        "key": 42505,
        "type": "date",
        "icon": "date-field",
        "formItemFlag": true,
        "options": {
            "name": "date118043",
            "label": "date",
            "labelAlign": "",
            "type": "date",
            "defaultValue": null,
            "placeholder": "",
            "columnWidth": "200px",
            "size": "",
            "autoFullWidth": true,
            "labelWidth": null,
            "labelHidden": false,
            "readonly": false,
            "disabled": false,
            "hidden": false,
            "clearable": true,
            "editable": false,
            "format": "YYYY-MM-DD",
            "valueFormat": "YYYY-MM-DD HH:mm:ss",
            "required": false,
            "requiredHint": "",
            "validation": "",
            "validationHint": "",
            "customClass": [],
            "labelIconClass": null,
            "labelIconPosition": "rear",
            "labelTooltip": null,
            "onCreated": "",
            "onMounted": "",
            "onChange": "",
            "onFocus": "",
            "onBlur": "",
            "onValidate": ""
        },
        "id": "date118043"
    }
}

export const SingleFileInputField = () => ({
    key:0,
    "type": "file-upload",
    "icon": "file-upload-field",
    "formItemFlag": true,
    "options": {
        "name": "costModelFile",
        "label": "costModelFile",
        "labelZh": "Cost Model File",
        "labelWidth": null,
        "labelHidden": false,
        "columnWidth": "200px",
        "disabled": false,
        "hidden": false,
        "required": false,
        "requiredHint": "",
        "customRule": "",
        "customRuleHint": "",
        "uploadURL": "/api/docpal/workflow/files/upload",
        "uploadTip": "",
        "withCredentials": true,
        "multipleSelect": false,
        "showFileList": true,
        "fileMaxSize": 1,
        "fileTypes": [],
        "customClass": [],
        "labelIconClass": null,
        "labelIconPosition": "rear",
        "labelTooltip": null,
        "onCreated": "",
        "onMounted": "",
        "onBeforeUpload": "",
        "onUploadSuccess": "",
        "onUploadError": "const tips = localStorage.getItem(\"v_form_locale\") === 'zh-CN' ? \"上传失败\" : \"Upload Failed\"\nconst message = JSON.parse(error.message).message\nthis.$message({\n  message: `${ tips }：${ message }`,\n  duration: 3000,\n  type: 'error'\n})",
        "onFileRemove": "const id = file.id || file.response[0].contentId\nif (!id) return\n$api.delete(`/docpal/workflow/task/attachment?attachmentId=${id}`,{baseURL: '/client'}).then(res => {\n  this.getFormRef().$emit('handleSave')\n}).catch(err => {\n})",
        "onValidate": "",
        limit: 1
    },
    "id": "fileupload63075"
})