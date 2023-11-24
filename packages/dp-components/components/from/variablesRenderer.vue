<template>
<FromRenderer ref="FromRendererRef" :form-json="formJson" @formChange="formChange"
    @emit="handleEmit"/>    
</template>
<script lang="ts" setup>
export type variableItem = {
    name: string,
    type: 'date' | 'input' | 'switch' | 'textarea' | 'number' | 'select',
    disabled: Boolean,
    hidden: Boolean,
    required: Boolean,
    // format?: string,
    options?: any[],
    // maxLength?: number,
    // onValidate?: string
}
const props = defineProps<{
    variables: variableItem[],
}>()
const emits = defineEmits(['formChange'])
const FromRendererRef = ref()
const formJson = ref({
    "widgetList": [],
    "formConfig": {
        "modelName": "formData",
        "refName": "vForm",
        "rulesName": "rules",
        "labelWidth": 80,
        "labelPosition": "top",
        "size": "",
        "labelAlign": "label-left-align",
        "cssCode": "",
        "customClass": [],
        "functions": "",
        "layoutType": "PC",
        "jsonVersion": 3,
        "onFormCreated": "",
        "onFormMounted": "",
        "onFormDataChange": "",
        "onFormValidate": "",
        "saveRemoteOptions": "never",
        "labelFormUniqueName": true,
        "dataSources": []
    }
})
function createJson(variables: variableItem[]) {
    const date = new Date().valueOf()
    formJson.value.widgetList = []
    variables.forEach((item, index) => {
        const _item = {
            key: date + index,
            id: item.type + date + index,
            type: item.type,
            formItemFlag: true,
            options: {
                name: item.name,
                label: item.label ? item.label : item.name,
                required: item.required ? true : false,
                defaultValue: '',
                size: '',
                columnWidth: '',
                placeholder: '',
                readonly: false,
                disabled: false,
                hidden: false,
                clearable: true,
                requiredHint: '',
                onValidate: "",
                onCreated: "",
                onMounted: "",
                onInput: "",
                onChange: "",
                onFocus: "",
                onBlur: "",
                onEnter: "",
            }
        }
        if(!['date','input','switch','textarea','number','select'].includes(item.type)) _item.type = 'input'
        if(item.type === 'date') {
            _item.options.format = 'YYYY-MM-DD HH:mm',  //日期显示格式
            _item.options.valueFormat = 'YYYY-MM-DDTHH:mm:ss.000Z'
        } else if(item.type === 'input') {
            _item.options.type = 'text'
        } else if(item.type === 'textarea') {
            _item.options.rows = 5
        }else if(item.type === 'number') {
            _item.options.defaultValue = 0
            _item.options.min = -999999999999999
            _item.options.max = 999999999999999
            _item.options.controlsPosition = 'right'
        } else if(item.type === 'switch') {
            _item.options.defaultValue = false
            _item.options.labelIconPosition = 'rear'
        } else if(item.type === 'select') {
        }
        if (item.options) _item.options = { ..._item.options, ...item.options }
        formJson.value.widgetList.push(_item)
    })
    FromRendererRef.value.vFormRenderRef.setFormJson(formJson.value)
    return formJson.value
}
function handleEmit (funName, newValue, oldValue) {
    emits(funName, newValue, oldValue)
}
async function getData () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    return data
}
async function setFormJson (formJson) {
    await FromRendererRef.value.vFormRenderRef.setFormJson(formJson)
}
async function setData (data) {
    await FromRendererRef.value.vFormRenderRef.setFormData(data)
}
function formChange(fieldName, newValue, oldValue, formModel) {
    emits('formChange', {fieldName,newValue,oldValue,formModel})
}
defineExpose({ createJson, getData, setData, setFormJson })
</script>
<style lang="scss" scoped>

</style>
