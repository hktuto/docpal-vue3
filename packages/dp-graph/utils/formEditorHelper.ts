

export const  fieldType = [
    "Single line input" , 
    "Multi line input",
    "Date",
    "Boolean",
    "Current User",
    "User Dropdown",
    "User Group Dropdown",
    "Custom Dropdown",
    "File", 
    "Multiple files"
]
export type FormObject = {
    attr_id: string,
    attr_name:string,
    attr_type: string,
    attr_readable?:boolean,
    attr_field_label:string,
    attr_field_writable?:boolean,
    attr_field_type: typeof fieldType[number],
    attr_field_required?:boolean,
    attr_field_hidden?:boolean,
    attr_field_disabled?:boolean,
    attr_field_validate?:string,
    attr_field_valid: boolean,
    attr_field_default_value?: any,
}

const defaultForm = {
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
}
export const bpmnStepToForm = (step:FormObject[], form:any ) => {
    const baseForm = {...defaultForm};
    baseForm.widgetList = [] ;
    step.forEach((formObject:FormObject) => {
        switch(formObject.attr_field_type){
            case "Single line input":
                baseForm.widgetList.push(createSingleLineInput(formObject));
                break;
            case "Multi line input":
                baseForm.widgetList.push(createMultiLineInput(formObject));
                break;
            case "Current User":
                baseForm.widgetList.push(createCurrentUserInput(formObject));
                break;
            case 'User Dropdown':
                baseForm.widgetList.push(createUserDropdownInput(formObject, form));
                break;
            case "Date":
                baseForm.widgetList.push(createDateInput(formObject));
                break;
            case "File":
                baseForm.widgetList.push(createFileInput(formObject));
                break;
            case "Dropdown":
                // baseForm.widgetList.push(createDropdownInput(formObject));
                break;
        }
    })
    
    return baseForm;
}

const createSingleLineInput = (formObject: FormObject):any => {
    return {
        "key": Date.now(),
        "type": "input",
        "icon": "text-field",
        "formItemFlag": true,
        "options": {
            "name": formObject.attr_id,
            "label": formObject.attr_field_label,
            "labelAlign": "",
            "type": "text",
            "defaultValue": "",
            "placeholder": "",
            "columnWidth": "200px",
            "size": "",
            "labelWidth": null,
            "labelHidden": false,
            "readonly": formObject.attr_field_writable,
            "disabled": formObject.attr_field_disabled,
            "hidden": formObject.attr_field_hidden,
            "clearable": true,
            "showPassword": false,
            "required": formObject.attr_field_required,
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
        "id": 'form_' + formObject.attr_id
    }
    
}

const createMultiLineInput = (formObject: FormObject) => {
    return {
        "key": Date.now(),
        "type": "textarea",
        "icon": "textarea-field",
        "formItemFlag": true,
        "options": {
            "name": formObject.attr_id,
            "label": formObject.attr_field_label,
            "labelAlign": "",
            "rows": 3,
            "defaultValue": "",
            "placeholder": "",
            "columnWidth": "200px",
            "size": "",
            "labelWidth": null,
            "labelHidden": false,
            "readonly": formObject.attr_field_writable,
            "disabled": formObject.attr_field_disabled,
            "hidden": formObject.attr_field_hidden,
            "required": formObject.attr_field_required,
            "requiredHint": "",
            "validation": "",
            "validationHint": "",
            "customClass": "",
            "labelIconClass": null,
            "labelIconPosition": "rear",
            "labelTooltip": null,
            "minLength": null,
            "maxLength": null,
            "showWordLimit": false,
            "onCreated": "",
            "onMounted": "",
            "onInput": "",
            "onChange": "",
            "onFocus": "",
            "onBlur": "",
            "onValidate": ""
        },
        "id": 'form_' + formObject.attr_id
    }
}

const createDateInput = (formObject: FormObject) => {
    return {
        "key": Date.now(),
        "type": "input",
        "icon": "text-field",
        "formItemFlag": true,
        "options": {
            "name": formObject.attr_id,
            "label": formObject.attr_field_label,
            "labelZh": "创建者",
            "labelAlign": "",
            "type": "text",
            "defaultValue": "",
            "placeholder": "",
            "columnWidth": "200px",
            "size": "",
            "labelWidth": null,
            "labelHidden": false,
            "readonly": formObject.attr_field_writable,
            "disabled": formObject.attr_field_disabled,
            "hidden": formObject.attr_field_hidden,
            "required": formObject.attr_field_required,
            "clearable": true,
            "showPassword": false,
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
            "onMounted": "const user = $getCookie('docpal-user');\nthis.setValue(user.userId||user.username)",
            "onInput": "",
            "onChange": "",
            "onFocus": "",
            "onBlur": "",
            "onValidate": ""
        },
        "id": 'form_' + formObject.attr_id
    }
}

const createCurrentUserInput = (formObject: FormObject) => {
    return {
        "key": Date.now(),
        "type": "input",
        "icon": "text-field",
        "formItemFlag": true,
        "options": {
            "name": formObject.attr_id,
            "label": formObject.attr_field_label,
            "labelZh": "创建者",
            "labelAlign": "",
            "type": "text",
            "defaultValue": "",
            "placeholder": "",
            "columnWidth": "200px",
            "size": "",
            "labelWidth": null,
            "labelHidden": false,
            "readonly": formObject.attr_field_writable,
            "disabled": formObject.attr_field_disabled,
            "hidden": formObject.attr_field_hidden,
            "required": formObject.attr_field_required,
            "clearable": true,
            "showPassword": false,
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
            "onMounted": "const user = $getCookie('docpal-user');\nthis.setValue(user.userId||user.username)",
            "onInput": "",
            "onChange": "",
            "onFocus": "",
            "onBlur": "",
            "onValidate": ""
        },
        "id": 'form_' + formObject.attr_id
    }
}

const createFileInput = (fromObject: FormObject) => {
     return{}
}

const createUserDropdownInput = (formObject: FormObject, step:any) => {
     return {
         "key": Date.now(),
         "type": "select",
         "icon": "select-field",
         "formItemFlag": true,
         "options": {
             "name": formObject.attr_id,
             "label": formObject.attr_field_label,
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
             "readonly": formObject.attr_field_writable,
             "disabled": formObject.attr_field_disabled,
             "hidden": formObject.attr_field_hidden,
             "required": formObject.attr_field_required,
             "requiredHint": "",
             "validation": "",
             "validationHint": "",
             "customClass": [],
             "labelIconClass": null,
             "labelIconPosition": "rear",
             "labelTooltip": null,
             "onCreated": "",
             "onMounted": "this.loadOptions([])\n$api.post('/docpal/workflow/task/candidatesByTaskDefinitionKey?taskDefinitionKey=approvalForm&processKey=costModelApproval', {}).then(res => {\n   res = res.data.data\n  const reponse = res.map(item => ({\n    value: item.userId,\n    label: `${item.username}<${item.email}>`\n  }))\n  this.loadOptions(reponse)\n}).catch(err => {\n})",
             "onRemoteQuery": "",
             "onChange": "// const prospectNameRef = this.getWidgetRef('prospectName')\n// prospectNameRef.setValue(value)",
             "onFocus": "",
             "onBlur": "",
             "onValidate": ""
         },
         "id": "select26617"
     }
}