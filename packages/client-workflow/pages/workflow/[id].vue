<template>
<NuxtLayout class="fit-height withPadding " :backPath="`/workflow?tab=${backState}`">
    <div class="grid-layout">
        <WorkflowDetailCompleteInfo v-if="state.processState[backState]" :taskDetail="taskDetail" :state="backState"></WorkflowDetailCompleteInfo>
        <WorkflowDetailInfo v-else :taskDetail="taskDetail"></WorkflowDetailInfo>
        <el-tabs v-model="activeTab" class="grid-layout-tab" @tab-change="tabChange">
            <el-tab-pane :label="$t('workflow_form')" name="form" v-loading="state.loading">
                <WorkflowDetailFormRender ref="vFormRef" />
            </el-tab-pane>
            <el-tab-pane :label="$t('workflow_activity')" name="activity">
                <WorkflowDetailActivity :activityList="state.activityList" />
            </el-tab-pane>
            <el-tab-pane :label="$t('workflow_graph')" name="graph">
                <WorkflowDetailGraph :processDefinitionId="taskDetail.processDefinitionId" :steps="getCurrentStep"/>
            </el-tab-pane>
        </el-tabs>
        <WorkflowDetailDiscussionChannel :id="route.params.id"/>
    </div>
</NuxtLayout>
</template>

<script lang="ts" setup>
import {
    getTaskApi, // 获取未完成的任务详情
    historyProcessDetailGetApi, // 获取已完成的任务详情
    activeProcessDetailGetApi, // 获取参与中的任务详情
    taskFormJsonGetApi,
    getActivityApi
} from 'dp-api'
const route = useRoute()
const router = useRouter()
const state = reactive({
    backState: route.query.state,
    processState: {
        'completeTask': 'completeTask', 
        'activeTask': 'activeTask'
    },
    activeTab: 'form',
    taskDetail: {},
    activityList: [],
    loading: false,
})
const { activeTab, backState, taskDetail, form } = toRefs(state)
function tabChange (tab) {
    router.push({query: { tab, state: state.backState }})
}
async function getDetail() {
    const processInstanceId = route.params.id
    switch(state.backState) {
        case state.processState.completeTask:
            state.taskDetail = await historyProcessDetailGetApi({ processInstanceId, completed: true })
            break
        case state.processState.activeTask:
            state.taskDetail = await activeProcessDetailGetApi(processInstanceId)
            break
        default:
            state.taskDetail = await getTaskApi(processInstanceId)
    }
    handleGetActivity(processInstanceId)
    setTimeout(async() => {
        state.loading = true
        await handleFormDataGet()
        state.loading = false
    }, 100)

}
// #region module: form
    const vFormRef = ref()
    async function handleFormDataGet () {
        switch(state.backState) {
            case state.processState.completeTask:
            case state.processState.activeTask:
                const formData = formDataGet(state.taskDetail.processVariables)
                const formJson = await formJsonGet('complete', state.taskDetail.processDefinitionKey)
                vFormRef.value.setForm(formJson, formData)
                break
            default:
                break
        }
    }
    function formDataGet (obj) {
        return Object.keys(obj).reduce((prev, key) => {
                    prev[key] = String(obj[key])
                    return prev
                }, {})
    }
    async function formJsonGet (userTaskId:string, processKey:string) {
        const response = await taskFormJsonGetApi({userTaskId, processKey})
        if (!response.data[0] ||
            response.data[0] && !response.data[0].jsonValue) return {}
        return JSON.parse(response.data[0].jsonValue)
    }
// #endregion
// #region module: activity 
    async function handleGetActivity (processInstanceId) {
        state.activityList = await getActivityApi(processInstanceId)
    } 
// #endregion
// #region module: graph
    const getCurrentStep = computed(() => state.activityList.map( activity => activity.originalPersistentState.activityId))
// #endregion
onMounted(() => {
    getDetail()
})
watch(() => route.query, (q) => {
    state.activeTab = q.tab || 'form'
}, { immediate: true })
</script>

<style lang="scss" scoped>
.grid-layout {
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    height: 100%;
    gap: var(--app-padding);
    overflow: hidden;
}
.grid-layout-tab {
    display: grid;
    grid-template-rows: min-content 1fr;
    height: 100%;
    overflow: hidden;
    :deep(.el-tab-pane) {
        height: 100%;
    }
}
</style>
