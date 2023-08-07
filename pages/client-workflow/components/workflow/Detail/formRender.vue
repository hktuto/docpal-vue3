<template>
    <FromRenderer :class="{vformReadonly: state.readonly, workflowForm: true}" ref="FromRendererRef" :formJson="formJson" :data="formData"
        @previewFileInit="handlePreviewFileInit">
        <template v-slot:previewFile="{data}">
            <WorkflowDetailReader class="WorkflowDetailReader" ref="WorkflowReaderRef"></WorkflowDetailReader>
        </template>
    </FromRenderer>
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
    readonly: false,
})
const WidgetNames = {
    arr: ['sub-form'],
    upload: ['file-upload'],
    select: ['select']
}
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
        // 处理sub-form
        const arrWidgetKeys = getWidgetNames(WidgetNames.arr)
        const uploadWidgetKeys = getWidgetNames(WidgetNames.upload)
        const selectWidgetKeys = getWidgetNames(WidgetNames.select, true)
        const result = [] 
        const pList = []
        
        Object.keys(data).forEach((key) => {
            pList.push(revert(key, data[key]))
        })
        await Promise.all(pList)
        return result
        async function revert(key, value) {
            if (arrWidgetKeys.includes(key))
                result[key] = value ? JSON.parse(value) : []
            else if (uploadWidgetKeys.includes(key))  
                result[key] = await revertUploadFile(value)
            else if (selectWidgetKeys.includes(key)) 
                result[key] = value ? value.split(',') : ''
            else if (value!== null) 
                result[key] = value
        }
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
        const arrWidgetKeys = getWidgetNames(WidgetNames.arr)
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
                if (arrWidgetKeys.includes(key)) {
                    data[key] = JSON.stringify(_data)
                } else if (_data.length > 0 && (!!_data[0].response || !!_data[0].id)) {
                    const values = _data.reduce((prev, item) => {
                        if(item.response) {
                            item.response = item.response.data ? item.response.data : item.response
                            prev.push(item.response[0].contentId)
                        } else {
                            prev.push(item.id)
                        }
                        return prev
                    }, [])
                    data[key] = values.join(',')
                } else {
                    const values = _data.reduce((prev, item) => {
                        prev.push(item)
                        return prev
                    },[])
                    data[key] = values.join(',')
                }
            }
        })
        return data
    }
    function getWidgetNames (widgetNames: string [], checkMultiple: boolean = false) {
        const containerWidgets = FromRendererRef.value.vFormRenderRef.getContainerWidgets()
        const fieldWidgets = FromRendererRef.value.vFormRenderRef.getFieldWidgets()
        return [...containerWidgets, ...fieldWidgets].reduce((prev,item) => {
            if(widgetNames.includes(item.type)) {
                if (checkMultiple) {
                    if (item.field.options.multiple) prev.push(item.name)
                }
                else prev.push(item.name)
            }
            return prev
        }, [])
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
// #region module: WorkflowReader
    const WorkflowReaderRef = ref()
    function handlePreviewFileInit (fileId: string) {
        if (WorkflowReaderRef.value && fileId) WorkflowReaderRef.value.init(fileId)
    }
// #endregion
onMounted(() => {
    
})
const { formData, formJson } = toRefs(state)
defineExpose({ setForm, getFormData, disableForm, enableForm })
</script>

<style lang="scss" scoped>
.workflowForm {
    height: 100%;
    overflow: hidden;
    :deep(.el-form) {
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }
}
</style>