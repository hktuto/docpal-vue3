<template>
    <div ref="filterContainerRef" class="filterContainer">
        <FromRenderer ref="FromRendererRef" :form-json="filterJson" @form-change="formChangeHandler" ></FromRenderer>
        <div class="filterContainer-footer">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-button type="info" @click="handleReset">{{$t('reset')}}</el-button>
                </el-col>
                <el-col :span="16">
                    <el-button type="primary" @click="handleSubmit">{{$t('search')}}</el-button>
                </el-col>
            </el-row>
            <el-button type="info" @click="handleDownload">{{$t('export')}}</el-button>
        </div>
        <WidthShrinker :targetDom="filterContainerRef"></WidthShrinker>
        <SearchDownloadDialog ref="SearchDownloadDialogRef" />
    </div>
</template>

<script lang="ts" setup>
import { deepCopy, getJsonApi, getSearchParamsArray } from 'dp-api'
const props = defineProps<{
    searchParams: any
}>()
const route = useRoute()
const router = useRouter()
const emits = defineEmits(['submit'])
const filterJson = getJsonApi('search.json')
const FromRendererRef = ref()
const filterContainerRef = ref()
const state = reactive({
    changeEvent: false
})
function formChangeHandler({fieldName,newValue,oldValue,formModel}) {
    if(!state.changeEvent) return
    const _data = dataHandle(formModel)
    goRoute(_data)
    // emits('submit', formModel)
}
function goRoute(formModel) {
    const searchBackPath = route.query.searchBackPath || ''
    const searchParams = getSearchParamsArray(formModel)
    const time = new Date().valueOf().toString()
    
    router.push({
        query: { 
            ...searchParams, 
            pageSize: 20,
            currentPageIndex: 1,
            searchBackPath,
            time
        }
    })
}
function handleSubmit () {
    const data = FromRendererRef.value.vFormRenderRef.getFormData(false)
    const _data = dataHandle(data)
    goRoute(_data)
    emits('submit', data)
}

function handleReset() {
    FromRendererRef.value.vFormRenderRef.resetForm()
}
function initForm () {
    setTimeout(async() => {
        const searchParams = deepCopy(props.searchParams)
        let key = props.searchParams.paramsInTextSearch
        if(!!key) searchParams.keyword = key
        searchParams.includeFolder = searchParams.includeFolder ? '1' : '0'
        if(searchParams.hight) {
            searchParams.hight = Array.isArray(searchParams.hight) ? searchParams.hight.join('') : searchParams.hight
        }
        if(searchParams.width) {
            searchParams.width = Array.isArray(searchParams.width) ? searchParams.width.join('') : searchParams.width
        }
        if(searchParams.duration) {
            searchParams.duration = Array.isArray(searchParams.duration) ? searchParams.duration.join('') : searchParams.duration
        }
        if(searchParams.mimeType) {
            searchParams.mimeType = Array.isArray(searchParams.mimeType) ? searchParams.mimeType.join('') : searchParams.mimeType
        }
        console.log({searchParams}, searchParams.includeFolder, 'ssssssssssssssssssssssssss');
        
        // searchParams.includeFolder = searchParams.includeFolder === '1' || searchParams.includeFolder === 1;
        await FromRendererRef.value.vFormRenderRef.setFormData(searchParams)
        state.changeEvent = true
    }, 800)
}
const SearchDownloadDialogRef = ref()
function dataHandle (formModel) {
    let _formModel = deepCopy(formModel)
    _formModel.paramsInTextSearch = _formModel.keyword
    delete _formModel.keyword
    return _formModel
}
function handleDownload () {
    let data = FromRendererRef.value.vFormRenderRef.getFormData(false)
    let _data = dataHandle(data)
    _data = getSearchParamsArray(_data)
    SearchDownloadDialogRef.value.handleOpen(_data)
}
onMounted(() => {
    console.log('??????????');
    
    initForm()
})
defineExpose({ handleSubmit })
</script>

<style lang="scss" scoped>
.filterContainer{
    height: 100%;
    display: grid;
    grid-template-rows: 1fr min-content;
    overflow: hidden;
    min-width: 250px;
    .formContainer {
        overflow-x: hidden;
        overflow-y: auto;
    }
    &-footer {
        padding: 0 6px;
        .el-button {
            margin: unset;
            margin-top: var(--app-padding);
            width: 100%;
        }
    }
}
</style>