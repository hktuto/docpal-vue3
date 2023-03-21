<template>
    <FromRenderer :class="{vformReadonly: state.readonly}" ref="FromRendererRef" :formJson="formJson" :data="formData"></FromRenderer>
</template>

<script lang="ts" setup>
import { attachmentInfoGetApi } from 'dp-api'
const props = defineProps<{
    options?: Object,
}>();
const state = reactive({
    formData: {}, 
    formJson: {},
    writableIds: [],
    readonly: false
})
const FromRendererRef = ref()
// #region module: set
    async function setForm (json: string | object, data?: object, properties:any[] = []) {
        state.formJson = json
        FromRendererRef.value.setFormJson(json)
        if (data && properties) {
            const _data = await handleData(data)
            state.formData = _data
            FromRendererRef.value.vFormRenderRef.setFormData(_data)
            handleTypeIds(properties)
        }
    }
    async function handleData(data) {
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
    async function revertUploadFile(ids) {
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
    function handleTypeIds(properties) {
      state.writableIds = []
      properties.forEach(item => {
        if (item.writable) state.writableIds.push(item.id)
      })
    }
// #endregion
// #region module: get
    async function getFormData (needValidation = true, onlyWritable = true) {
        let formData = {}
        if (!needValidation) formData = FromRendererRef.value.vFormRenderRef.getFormData(false)
        else formData = await FromRendererRef.value.vFormRenderRef.getFormData().then(res => {
            return res
        }).catch(error => {
            return false
        })
        if(!formData) return false
        return onlyWritable ? writableDataDeArray(formData) : dataDeArray(formData)
    }

    function writableDataDeArray(formDatas) {
        const data = { }
        state.writableIds.forEach(item => {
            data[item] = formDatas[item]
        })
        return dataDeArray(data)
    }
    function dataDeArray (formDatas: Object) {
        const data = Object.keys(formDatas).reduce((prev,key) => {
            if(formDatas[key] == '0' ||  formDatas[key] == 'false' || !!formDatas[key]) {
                prev[key] = formDatas[key]
            }
            return prev
        }, {})
        // const data = deepCopy(formDatas)
        Object.keys(data).forEach((key, _index) => {
            if (data[key] instanceof Array) {
            const idArrs = []
            if(data[key].length > 0 && (!!data[key][0].response || !!data[key][0].id)) {
                data[key].forEach(item => {
                idArrs.push(item.response ? item.response[0].contentId : item.id)
                })
            } else {
                data[key].forEach(item => {
                idArrs.push(item)
                })
            }
            data[key] = idArrs.join(',')
            }
        })
        return data
    }
// #endregion
// #region module:
    function enableForm () {
        state.readonly = false
        FromRendererRef.value.vFormRenderRef.enableForm()
    }
    function disableForm () {
        state.readonly = true
        FromRendererRef.value.vFormRenderRef.disableForm()
    }
// #endregion
onMounted(() => {
    
})
const { formData, formJson } = toRefs(state)
defineExpose({ setForm, getFormData, disableForm, enableForm })
</script>

<style scoped>
.formContainer {
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
}
</style>