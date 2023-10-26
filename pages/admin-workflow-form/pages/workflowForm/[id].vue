<template>
    <NuxtLayout class="fit-height withPadding" backPath="/workflowForm">

        <template #headerLeft>
            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                    <div class="ellipsis">{{state.workflowDetail.name}}</div>
                    <el-icon class="el-icon--right"> <ArrowDown /> </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item :class="{'current': item.id === state.activeTaskId}" v-for="item in state.workflowDetail.userTasks" :command="item.id">
                            {{item.name}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </template>
        <div style="height: 100%; overflow: hidden;">
            <FromDesigner ref="FromDesignerRef" :fieldListApi="state.fieldListApi">
                <template #submit>
                    <el-button type="text" :loading="state.submitLoading" @click="handleSubmit">{{$t('submit')}}</el-button>
                </template>
            </FromDesigner>
        </div>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { GetWorkflowApi, GetTaskFormJsonApi, SaveTaskFormJsonApi } from 'dp-api'
const route = useRoute()
const router = useRouter()
const state = reactive<State>({
    loading: false,
    submitLoading: false,
    activeTaskId: '',
    workflowDetail: {},
    fieldListApi: {}
})
// #region module:  fromDesigner
    const FromDesignerRef = ref()
    async function handleSubmit() {
        const json = FromDesignerRef.value.getFormJson()
        const param = {
            processKey: state.workflowDetail.key,
            userTaskId: state.activeTaskId,
            jsonValue: JSON.stringify(json)
        }
        state.submitLoading = true
        try {
            const res = await SaveTaskFormJsonApi(param)
            if(!!res)  ElMessage.success($t('msg_successfullyModified'))
        } catch (error) {
        }
        state.submitLoading = false
    }
    function handleFiledList () {
        // formProperties
        let taskDetail = state.workflowDetail.userTasks.find(item => item.id === route.query.taskId)
        state.fieldListApi = {
            labelKey: 'id',
            nameKey: 'id',
            data: taskDetail.formProperties ? taskDetail.formProperties : state.workflowDetail.userTasks[0].formProperties
        }
        console.log(state.fieldListApi.data)
    }
    async function handleGetJson (taskId) {
        state.loading = true
        try {
            const res = await GetTaskFormJsonApi({
                processKey: state.workflowDetail.key,
                userTaskId: taskId,
            })
            setTimeout(() => {
                FromDesignerRef.value.setFormJson(res.json)
            })
        } catch (error) {

        }
        state.loading = false
    }
// #endregion
// const shareInfoDialogRef = ref()
async function getWorkflowDetail() {
    state.workflowDetail = await GetWorkflowApi(route.params.id)

}
function handleCommand(command: string){
    router.push({
        query: { taskId: command }
    })
}

watch(() => route.query.taskId, async(newValue) => {
    if(!state.workflowDetail.key) await getWorkflowDetail()
    handleGetJson(newValue)
    handleFiledList()
    state.activeTaskId = newValue
}, { immediate: true })
</script>

<style lang="scss" scoped>
.el-dropdown-link {
    display: grid;
    grid-template-columns: min-content min-content;
    .ellipsis {
        max-width: 30vw;
    }
}
:deep(.current) {
    background-color: var(--el-dropdown-menuItem-hover-fill);
    color: var(--el-dropdown-menuItem-hover-color);
}
</style>
