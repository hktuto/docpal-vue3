<template>
<NuxtLayout class="fit-height withPadding " :backPath="`/workflow?tab=${backState}`">
    <div class="grid-layout">
        <el-tabs v-model="activeTab" class="grid-layout-tab" @tab-change="tabChange">
            <el-tab-pane class="grid-layout-tab-pane" :label="$t('workflow_info')" name="info" v-loading="state.loading">
                <WorkflowDetailCompleteInfo v-if="state.processState[backState]" :taskDetail="taskDetail" :state="backState"></WorkflowDetailCompleteInfo>
                <WorkflowDetailInfo v-else :taskDetail="taskDetail" @change="handleTaskInfoChange"></WorkflowDetailInfo>
            </el-tab-pane>
            <el-tab-pane class="grid-layout-tab-pane" :label="$t('workflow_form')" name="form" v-loading="state.loading">
                <WorkflowDetailFormRender ref="vFormRef" />
                <div class="grid-layout-tab-pane--btns" v-if="isAssigneeUser">
                    <el-button @click="handleSave">{{$t('workflow_save')}}</el-button>
                    <el-button type="primary" @click="handleSubmit">{{$t('common_submit')}}</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('workflow_activity')" name="activity">
                <WorkflowDetailActivity :activityList="state.activityList" />
            </el-tab-pane>
            <el-tab-pane :label="$t('workflow_graph')" name="graph">
                <!-- need to use v-if for bpmn, if not  svg graph will not show -->
                <WorkflowDetailGraph v-if="activeTab === 'graph'" :processDefinitionId="taskDetail.processDefinitionId || taskDetail.taskInstance?.processDefinitionId" :steps="getCurrentStep"/>
            </el-tab-pane>
          <el-tab-pane v-if="taskDetail && taskDetail.instanceId && isMobile" :label="$t('common_discussionChannel')" name="command">
            <WorkflowDetailDiscussionChannel v-if="taskDetail && taskDetail.instanceId" :id="taskDetail.instanceId" :noToggle="true"/>
          </el-tab-pane>
        </el-tabs>
        <WorkflowDetailDiscussionChannel v-if="taskDetail && taskDetail.instanceId && !isMobile" :id="taskDetail.instanceId"/>
    </div>
</NuxtLayout>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    getTaskApi, // 获取未完成的任务详情
    historyProcessDetailGetApi, // 获取已完成的任务详情
    activeProcessDetailGetApi, // 获取参与中的任务详情
    getFormPropsApi,
    taskFormJsonGetApi,
    getActivityApi,
    propertiesSaveApi,
    propertiesSubmitApi
} from 'dp-api'
const route = useRoute()
const router = useRouter()
const { isMobile } = useLayout()
const userId:string = useUser().getUserId()
const state = reactive({
    backState: route.query.state,
    processState: {
        'completeTask': 'completeTask',
    },
    activeTab: 'info',
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
    try {
        state.loading = true
        const processInstanceId = route.params.id
        switch(state.backState) {
            case state.processState.completeTask:
                state.taskDetail = await historyProcessDetailGetApi({ processInstanceId, completed: true })
                
                break
            default:
                state.taskDetail = await getTaskApi(processInstanceId)
        }
        handleGetActivity(state.taskDetail.instanceId || state.taskDetail.processInstanceId)

    } catch (error) {

    }
    setTimeout(async() => {
        try {
            await handleFormDataGet()
            handleDisabledForm()
        } catch (error) {

        }
        state.loading = false
    }, 100)
}
const isAssigneeUser = computed(() => {
    const id = state.taskDetail?.assignee || ""
    return id === userId
})
// #region module: form
    const vFormRef = ref()
    async function handleFormDataGet () {
        let formJson
        let formData
        switch(state.backState) {
            case state.processState.completeTask:
                formData = state.taskDetail.processVariables
                formJson = await formJsonGet('complete',state.taskDetail.processDefinitionKey)
            
                vFormRef.value.setForm(formJson, formData)
                break
            default:
                const properties = await getFormPropsApi({ taskId: route.params.id })
                formData = formDataGetFromProps(properties)
                console.log('formData', formData)
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
                    // if item type is boolean, convert string to boolean
                    if (item.type === 'boolean') {
                        item.value = item.value === 'true'
                    }
                    prev[item.id] = item.value
                    return prev
                }, {})
    }
    async function formJsonGet (userTaskId:string, processKey:string) {
        const response = await taskFormJsonGetApi({userTaskId, processKey})
        if (!response[0] ||
            response[0] && !response[0].jsonValue) return {}
        return JSON.parse(response[0].jsonValue)
    }
    function handleDisabledForm() {
        if(userId !== state.taskDetail.assignee) {
            vFormRef.value.disableForm()
        }
    }
    async function handleSave () {
        try {
            const data = await vFormRef.value.getFormData(false, false)
            state.loading = true
            const param = {
                taskId: route.params.id,
                properties: { ...data },
            }
            await propertiesSaveApi(param)
            ElMessage.success(`${$i18n.t('msg_successfulOperation')}`)
        } catch (error) {
            // ElMessage.error(error)
        }
        state.loading = false
    }
    async function handleSubmit () {
        state.loading = true
        try {
            const data = await vFormRef.value.getFormData(true, false)
            if (!data) throw new Error(`${$i18n.t('incompleteData')}`);
            // convert all item in data which is boolean to string
            Object.keys(data).forEach(key => {
                if (typeof data[key] === 'boolean') {
                    data[key] = String(data[key])
                }
            })
            const param = {
                taskId: route.params.id,
                properties: { ...data },
            }
            const res = await propertiesSubmitApi(param)
            if (res.errorCode) throw new Error(res.message || 'error');
            ElMessage.success(`${$i18n.t('msg_successfulOperation')}`)
            router.push(`/workflow?tab=${state.backState}`)
        } catch (error) {
            ElMessage.error(error.message)
        }
        state.loading = false
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
    try {
        taskDetail.value = { ...taskDetailRes }
        handleGetActivity( taskDetail.value.taskInstance?.processInstanceId)
        if (isClaim) {
            state.loading = true
            await handleFormDataGet()
        } else {
            vFormRef.value.disableForm()
        }
    } catch (error) {

    }
    state.loading = false
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
    grid-template-columns: 1fr min-content;
    height: 100%;
    gap: var(--app-padding);
    overflow: hidden;
    @media (max-width: 640px) {
      grid-template-columns: 1fr;
      grid-template-rows: min-content 1fr;
    }
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
.grid-layout-tab-pane {
    display: grid;
    grid-template-rows: 1fr min-content;
    &--btns {
        box-shadow: var(--el-box-shadow-light);
        padding: var(--app-padding);
        text-align: right;
    }
}
</style>
