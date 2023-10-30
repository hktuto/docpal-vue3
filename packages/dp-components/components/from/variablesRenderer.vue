<template>
<FromRenderer ref="FromRendererRef" :form-json="formJson" />    
</template>
<script lang="ts" setup>
export type variableItem = {
    name: string,
    type: string,
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
            id: date + index + 100,
            type: item.type === 'date' ? 'date' : 'input',
            formItemFlag: true,
            options: {
                name: item.name,
                label: item.name,
                required: item.required ? true : false
            }
        }
        if(item.type === 'date') {
            _item.options.format = 'YYYY-MM-DD HH:mm',  //日期显示格式
            _item.options.valueFormat = 'YYYY-MM-DD HH:mm'
        }
        formJson.value.widgetList.push(_item)
    })
    FromRendererRef.value.vFormRenderRef.setFormJson(formJson.value)
}
async function getData () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    return data
}
defineExpose({ createJson, getData })
</script>
<style lang="scss" scoped>

</style>
