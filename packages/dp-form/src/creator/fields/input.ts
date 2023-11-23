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

// TODO : create number field
export const NumberInputField = () => {
}