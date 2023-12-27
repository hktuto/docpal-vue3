<template>
<NuxtLayout class="fit-height withPadding" backPath="/smartFolder" :pageTitle="`${$t('admin_smartFolder')}/${$t('common_preview')}`">
    <div class="smartFolder" >
        <div class="smartFolder-header flex-x-between">
            <b style="font-size: 20px">{{state.setting.name}}</b>
            <el-button type="primary" :loading="state.loading" @click="handleSubmit">{{$t('dpTool_save')}}</el-button>
        </div>
        <div class="smartFolder-left-header">{{$t('smartFolder.searchQuery')}}</div>
        <div class="smartFolder-left-main">
            <FromRenderer ref="FromRendererRef" :form-json="formJson">
                <!-- <template #header>
                    <el-button type="primary" @click="handleSubmit">{{$t('dpTool_save')}}</el-button>
                </template> -->
            </FromRenderer>
        </div>
        <div class="smartFolder-left-bottom flex-x-center">
            <el-button type="info" @click="handleClear">{{$t('button.clearFilter')}}</el-button>
            <el-button class="test-button" type="primary" :loading="state.testLoading" @click="handleTest">{{$t('button.test')}}</el-button>
        </div>

        <div class="smartFolder-right-header">{{$t('smartFolder.searchResult')}}</div>
        <div class="smartFolder-right-main">
            <SmartFolderResultTable ref="SmartFolderResultTableRef" :queryParams="state.setting.json"
                @refresh="testFinish"/>
        </div>
    </div>
</NuxtLayout>
</template>


<script lang="ts" setup>
import { ElNotification, ElMessage, ElMessageBox } from 'element-plus'
import {
    UpdatePreSearchApi,
    GetPreSearchApi,
    getJsonApi
} from 'dp-api'

const router = useRouter()
const route = useRoute()
const state = reactive({
    setting: {},
    loading: false,
    testLoading: false,
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/adminPreSearch.json')
async function handleInit () {
    state.loading = true
    try {
        state.setting = await GetPreSearchApi(route.params.id)
        state.setting.json = JSON.parse(state.setting.json_value)
        console.log(state.setting.json, 'state.setting.json');
        
        setTimeout(async() => {
            FromRendererRef.value.vFormRenderRef.resetForm()
            FromRendererRef.value.vFormRenderRef.setFormData(state.setting.json)
            handleTest()
        })
    } catch (error) {
        
    }
    state.loading = false
}
function handleClear () {
    FromRendererRef.value.vFormRenderRef.resetForm()
}
async function handleTest() {
    state.testLoading = true
    try {
        state.setting.json = await FromRendererRef.value.vFormRenderRef.getFormData()
        router.push({
            query: {
                time: new Date().valueOf()
            }
        })
    } catch (error) {
    }
}
function testFinish () {
    setTimeout(() => {
        state.testLoading = false
    }, 300)
}
async function handleSubmit () {
    state.loading = true
    try {
        const data = await FromRendererRef.value.vFormRenderRef.getFormData()
        const param = deepCopy(data)
        if (!param.paramsInTextSearch) delete param.paramsInTextSearch
        const res = await UpdatePreSearchApi({
            ...state.setting,
            json_value: JSON.stringify(param)})
        if (!res.errorCode) {
        } else {
        }
    } catch (error) {

    }
    state.loading = false
}

onMounted(async() => {
    state.loading = false
    handleInit()
})
</script>

<style lang="scss" scoped>
.smartFolder {
    overflow: hidden;
    height: 100%;
    display: grid;
    grid-template-columns: minmax(min-content, 400px) 1fr;
    grid-template-rows: repeat(2, min-content) 1fr min-content;
    gap: var(--app-padding);
    .smartFolder-header { grid-area: 1 / 1 / 2 / 3; }
    .smartFolder-left-header { grid-area: 2 / 1 / 3 / 2; }
    .smartFolder-left-main { 
        grid-area: 3 / 1 / 4 / 2; 
        overflow-y: auto;
        overflow-x: hidden;
    }
    .smartFolder-left-bottom { 
        grid-area: 4 / 1 / 5 / 2;
        .test-button {
            flex: 1
        }
    }

    .smartFolder-right-header { grid-area: 2 / 2 / 3 / 3; }
    .smartFolder-right-main { grid-area: 3 / 2 / 5 / 3; }
}
</style>
