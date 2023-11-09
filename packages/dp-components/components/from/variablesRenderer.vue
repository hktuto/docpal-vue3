<template>
<FromRenderer ref="FromRendererRef" :form-json="formJson" />    
</template>
<script lang="ts" setup>
export type variableItem = {
    name: string,
    type: 'date' | 'input' | 'switch' | 'textarea' | 'number',
    disabled: Boolean,
    hidden: Boolean,
    required: Boolean
}
const props = defineProps<{
    variables: variableItem[],
}>()
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
        if(item.type === 'date') {
            _item.options.format = 'YYYY-MM-DD HH:mm',  //日期显示格式
            _item.options.valueFormat = 'YYYY-MM-DD HH:mm'
        } else if(item.type === 'input') {
            _item.options.type = 'text'
        } else if(item.type === 'number') {
            _item.options.controlsPosition = 'right'
        } else if(item.type === 'switch') {
            _item.options.defaultValue = false
            _item.options.labelIconPosition = 'rear'
        }
        formJson.value.widgetList.push(_item)
    })
    FromRendererRef.value.vFormRenderRef.setFormJson(formJson.value)
}
async function getData () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    return data
}
async function setData (data) {
    await FromRendererRef.value.vFormRenderRef.setFormData(data)
}
defineExpose({ createJson, getData, setData })
</script>
<style lang="scss" scoped>

</style>
