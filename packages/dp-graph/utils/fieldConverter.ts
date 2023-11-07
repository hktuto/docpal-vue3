import {DateInputField, MultiLineInputField, SingleInputField} from "./defaultFormObject";
import {useWorkflowGraph} from "../composables/useWorkflowGraph";
import {FormObject} from "./formEditorHelper";

export const createSingleLineInput = (formObject: FormObject):any => {
    const field = SingleInputField();
    return createFieldOptions(field, {
        name: formObject.attr_id,
        label: formObject.attr_field_label,
        readonly: formObject.attr_field_writable,
        disabled: formObject.attr_field_disabled,
        hidden: formObject.attr_field_hidden,
        required: formObject.attr_field_required,
    })
}

export const createMultiLineInput = (formObject: FormObject) => {
    const field = MultiLineInputField();
    return createFieldOptions(field, {
        name: formObject.attr_id,
        label: formObject.attr_field_label,
        readonly: formObject.attr_field_writable,
        disabled: formObject.attr_field_disabled,
        hidden: formObject.attr_field_hidden,
        required: formObject.attr_field_required,
    })

}

export const createDateInput = (formObject: FormObject) => {
    const field = DateInputField();
    return createFieldOptions(field, {
        name: formObject.attr_id,
        label: formObject.attr_field_label,
        readonly: formObject.attr_field_writable,
        disabled: formObject.attr_field_disabled,
        hidden: formObject.attr_field_hidden,
        required: formObject.attr_field_required,
    })
}

export const createCurrentUserInput = (formObject: FormObject) => {
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

export const createFileInput = (fromObject: FormObject) => {
    return{}
}
export const createBooleanInput = (formObject: FormObject) => {
}
const createApproverDropDown = (formObject: FormObject, targetStep:string) => {
}

export const createUserDropdownInput = (formObject: FormObject, step:any) => {
    const { bpmnJson } = useWorkflowGraph()
    console.log(step)
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
            "onMounted": "this.loadOptions([])\n$api.post('/docpal/workflow/task/candidatesByTaskDefinitionKey?taskDefinitionKey="+ "approvalForm" +"&processKey=" +   bpmnJson.value.definitions.process.attr_id + "', {}, { baseURL: '/client'}).then(res => {\n   res = res.data.data\n  const reponse = res.map(item => ({\n    value: item.userId,\n    label: `${item.username}<${item.email}>`\n  }))\n  this.loadOptions(reponse)\n}).catch(err => {\n})",
            "onRemoteQuery": "",
            "onChange": "",
            "onFocus": "",
            "onBlur": "",
            "onValidate": ""
        },
        "id": "select26617"
    }
}
type FormOptions = {
    readonly?: boolean,
    disabled?: boolean,
    hidden?: boolean,
    required?: boolean,
    name?: string,
    label?: string,
    [key:string]: any
}
function createFieldOptions(field:any, options:FormOptions)  {
    field.options = Object.assign(field.options, options)
    field.key = Date.now()
    field.id = 'form_' + field.options.name
    return field
}