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
            <el-button v-if="false" type="info" @click="handleSubmit">{{$t('submit')}}</el-button>
        </div>
        <WidthShrinker :targetDom="filterContainerRef"></WidthShrinker>
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
    goRoute(formModel)
    emits('submit', formModel)
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
    goRoute(data)
    emits('submit', data)
}

function handleReset() {
    FromRendererRef.value.vFormRenderRef.resetForm()
}
function initForm () {
    setTimeout(async() => {
        const searchParams = deepCopy(props.searchParams)
        let key = props.searchParams.paramsInTextSearch
        if(!!key) searchParams.keyword = key.join('')
        await FromRendererRef.value.vFormRenderRef.setFormData(searchParams)
        state.changeEvent = true
    }, 800)
}
onMounted(() => {
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