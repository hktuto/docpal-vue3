<template>
<NuxtLayout class="fit-height withPadding " :backPath="`/workflow?tab=${backState}`">
    <div class="grid-layout">
        <div>
            <WorkflowDetailCompleteInfo v-if="state.processState[backState]" :taskDetail="taskDetail" :state="backState"></WorkflowDetailCompleteInfo>
            <WorkflowDetailInfo v-else :taskDetail="taskDetail" @change="handleTaskInfoChange"></WorkflowDetailInfo>
        </div>
        <el-tabs v-model="activeTab" class="grid-layout-tab" @tab-change="tabChange">
            <el-tab-pane :label="$t('workflow_form')" name="form" v-loading="state.loading">
                <WorkflowDetailFormRender ref="vFormRef" />
                <!-- <template v-if="submitShow">
                    <Button @click="handleSave">{{$t('workflow_save')}}</Button>
                    <Button type="primary" @click="handleSubmit">{{$t('common_submit')}}</Button>
                </template> -->
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
    getFormPropsApi,
    taskFormJsonGetApi,
    getActivityApi
} from 'dp-api'
const route = useRoute()
const router = useRouter()
const userStore = useUser();
const { user } = toRefs(userStore)
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
    submitShow: false
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
    handleGetActivity(state.taskDetail.instanceId)
    setTimeout(async() => {
        state.loading = true
        await handleFormDataGet()
        state.loading = false
        handleDisabledForm()
    }, 100)
}
// #region module: form
    const vFormRef = ref()
    async function handleFormDataGet () {
        let formJson
        let formData
        switch(state.backState) {
            case state.processState.completeTask:
            case state.processState.activeTask:
                formData = formDataGet(state.taskDetail.processVariables)
                formJson = await formJsonGet('complete', state.taskDetail.processDefinitionKey)
                vFormRef.value.setForm(formJson, formData)
                break
            default:
                const properties = await getFormPropsApi({ taskId: route.params.id })
                formData = formDataGetFromProps(properties)
                formJson = await formJsonGet(state.taskDetail.taskDefinitionKey,
                                state.taskDetail.taskInstance.processDefinitionKey)
                vFormRef.value.setForm(formJson, formData)
                break
        }
    }
    function formDataGet (obj) {
        return Object.keys(obj).reduce((prev, key) => {
                    prev[key] = String(obj[key])
                    return prev
                }, {})
    }
    function formDataGetFromProps (list) {
        return list.reduce((prev, item) => {
                    prev[item.id] = item.value
                    return prev
                }, {})
    }
    async function formJsonGet (userTaskId:string, processKey:string) {
        const response = await taskFormJsonGetApi({userTaskId, processKey})
        if (!response.data[0] ||
            response.data[0] && !response.data[0].jsonValue) return {}
        return JSON.parse(response.data[0].jsonValue)
    }
    function handleDisabledForm() {
        const userId = user.value.userId || user.value.username
        if(userId !== state.taskDetail.assignee) {
            vFormRef.value.disableForm()
        }
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

 // taskClaim后 处理taskDetail并重新请求getActivity
const handleTaskInfoChange = async (taskDetailRes, isClaim) => {
    taskDetail.value = { ...taskDetailRes }
    handleGetActivity( taskDetail.value.taskInstance?.processInstanceId)
    if (isClaim) {
        state.loading = true
        await handleFormDataGet()
        state.loading = false
    } else {
        vFormRef.value.disableForm()
    }
}
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
