<template>
<NuxtLayout class="fit-height withPadding"
    backPath="/retentionManage" 
    :pageTitle="`${$t('admin_retention')}>${state.setting.policyName}`" >
    <div class="rd-container" v-loading="state.loading">
        <div class="rd-container--title flex-x-between">
            <div>
                {{$t('user_active')}}
                <el-switch class="el-icon--right"
                    v-model="state.setting.status" 
                    active-value="A" inactive-value="D"
                    :loading="state.activeLoading"
                    @change="handleSetStatus" />
            </div>
            <div>
                <el-button type="danger" @click="handleDelete">{{$t('common_delete')}}</el-button>
                <el-button type="primary" @click="handleSubmit">{{$t('common_submit')}}</el-button>
            </div>
        </div>
        <FromRenderer class="rd-container--main" ref="FromRendererRef" :form-json="formJson"></FromRenderer>
        <div class="rd-container--right"></div>
    </div>
</NuxtLayout>
</template>
<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import { 
    getJsonApi, 
    GetRetentionDetailApi, 
    UpdateRetentionStatusApi,
    UpdateRetentionApi, 
    DeleteRetentionApi } from 'dp-api'
const emits = defineEmits([
    'update'
])
const state = reactive({
    loading: false,
    activeLoading: false,
    setting: {},
})
const router = useRouter()
const route = useRoute()
const FromRendererRef = ref()
const formJson = getJsonApi('admin/retention.json')
async function handleSubmit() {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    if(!data) return
    const params = {
        ...state.setting,
        ...data,
        actionType: data.actionType ? 'D' : 'A',
        status: state.setting.status
    }
    try {
        state.loading = true
        await UpdateRetentionApi(params)
        emits('update')
    } catch (error) {
        init()
    }
    state.loading = false
}
async function handleDelete (collection) {
    const action = await ElMessageBox.confirm(`${$t('msg_confirmWhetherToDelete')}`)
    if(action !== 'confirm') return
    state.loading = true
    try {
        const result = await DeleteRetentionApi(route.params.id)
        if(!!result) router.push('/retentionManage')
    } catch (error) {
    }
    state.loading = false
}
async function init() {
    state.loading = true
    let setting = await GetRetentionDetailApi(route.params.id)
    setTimeout(async() => {
        state.setting = setting
        state.setting.actionType = setting.actionType === 'D' ? true : false
        await FromRendererRef.value.vFormRenderRef.setFormData({...state.setting})
        state.loading = false
    })
}
async function handleSetStatus (status) {
    if(!state.setting.id) return
    state.activeLoading = true
    try {
        const isSuccess = await UpdateRetentionStatusApi(state.setting.id, status)
        if(isSuccess !== true) state.setting.status = state.setting.status === 'A' ? 'D' : 'A'
        else ElMessage.success($t('dpMsg_success'))
    } catch (error) {
    }
    state.activeLoading = false
}
onMounted(() => {
    init()
})
</script>
<style lang="scss" scoped>
.rd-container {
    display: grid;
    grid-template-columns: 1fr min-content;
    grid-template-rows: min-content 1fr;
    grid-column-gap: var(--app-padding);
    grid-row-gap: var(--app-padding);
    height: 100%;
    overflow: hidden;
}

.rd-container--title { 
    grid-area: 1 / 1 / 2 / 2;
}
.rd-container--main { 
    grid-area: 2 / 1 / 3 / 2; 
    overflow-y: auto;
    overflow-x: hidden;
}
.rd-container--right { grid-area: 1 / 2 / 3 / 3; }
</style>
