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
        const result = Object.keys(data).reduce((prev, key) => {
            if (data[key]!== null) prev[key] = data[key]
            return prev
        }, {})
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
    async function getFormData (needValidation = true, onlyWritable = false) {
        let formData = {}
        if (!needValidation) formData = FromRendererRef.value.vFormRenderRef.getFormData(false)
        else formData = await FromRendererRef.value.vFormRenderRef.getFormData().then(res => {
            return res
        }).catch(error => {
            return false
        })
        if(!formData) return false
        dpLog({formData});
        
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
            const _data = toRaw(data[key])
            if (_data instanceof Array) {
                const idArrs = []
                if(_data.length > 0 && (!!_data[0].response || !!_data[0].id)) {
                    _data.forEach(item => {
                        item.response = item.response.data ? item.response.data : item.response
                        idArrs.push(item.response ? item.response[0].contentId : item.id)
                    })
                } else {
                    _data.forEach(item => {
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