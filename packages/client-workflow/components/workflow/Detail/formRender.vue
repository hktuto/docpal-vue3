<template>
    <FromRenderer :class="{vformReadonly: readonly}" ref="FromRendererRef" :formJson="formJson" :data="formData"></FromRenderer>
</template>

<script lang="ts" setup>
import { attachmentInfoGetApi } from 'dp-api'
const props = defineProps<{
    options?: Object,
}>();
const state = reactive({
    formData: {}, 
    formJson: {}
})
const FromRendererRef = ref()
async function setForm (json: string | object, data: object) {
    state.formJson = json
    FromRendererRef.value.setFormJson(json)

    const _data = await handleData(data)
    state.formData = _data
    FromRendererRef.value.vFormRenderRef.setFormData(_data)
}
const handleData = async(data) => {
    const result = deepCopy(data)
    const widgets = FromRendererRef.value.vFormRenderRef.getFieldWidgets()
    
    for(let i = 0; i < widgets.length; i++) {
        const widgetItem = widgets[i]
        if (widgetItem.type === 'file-upload') {
            if (data[widgetItem.name]) result[widgetItem.name] = await revertUploadFile(data[widgetItem.name])
        } else if (widgetItem.type === 'select' && widgetItem.field.options.multiple) {
            if (data[widgetItem.name]) result[widgetItem.name] = data[widgetItem.name].split(',')
        }
    }
    return result
}
async function revertUploadFile (ids) {
    const pList = []
    const result = []
    if(!ids) return result
    ids = ids.split(',')
    for (const item of ids) {
        const promiseItem = attachmentInfoGetApi(item)
        pList.push(promiseItem)
    }
    const response = await Promise.all(pList)
    response.forEach(item => {
        if(item.name) result.push({ id: item.contentId, name: item.name })
    })
    return result
}
function getFormData () {
    console.log(FromRendererRef.value.vFormRenderRef);
    
    FromRendererRef.value.vFormRenderRef.getFormData(false)
}
onMounted(() => {
    
})
const { formData, formJson } = toRefs(state)
defineExpose({ setForm, getFormData })
</script>

<style scoped>
.formContainer {
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
}
</style>