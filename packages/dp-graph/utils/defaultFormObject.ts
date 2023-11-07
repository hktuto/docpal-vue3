
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


export const MultiLineInputField = () => {
    const field = SingleInputField()
    field.type = 'textarea'
    field.icon = 'textarea-field'
    return field
}

export const DateInputField = () => {
    return {
        "key": 27440,
        "type": "time",
        "icon": "time-field",
        "formItemFlag": true,
        "options": {
            "name": "time61471",
            "label": "time",
            "labelAlign": "",
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
            "format": "HH:mm:ss",
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
        "id": "time61471"
    }
}