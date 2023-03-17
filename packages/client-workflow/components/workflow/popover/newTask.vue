<template>
<el-dropdown @command="workflowClickHandler">
    <el-button type="primary">
        {{$t('workflow_newWorkflow')}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
        <el-dropdown-menu>
            <el-dropdown-item v-for="wf in state.availableWorkflow" :key="wf.id"
                :command="wf">{{wf.name}}</el-dropdown-item>
        </el-dropdown-menu>
    </template>
</el-dropdown>
<el-dialog v-model="state.formDialogVisible" :title="state.selectedWorkflow.name"
    destroy-on-close append-to-body width="60%"
    :close-on-click-modal="false"
    class="scroll-dialog"
    >
    <WorkflowDetailGraph :process-key="state.selectedWorkflow.key" step="start"/>
    <WorkflowDetailFormRender ref="vFormRef" />
    <template #footer>
        <el-button @click="checkAndSubmit">{{$t('workflow_startWorkflow')}}</el-button>
    </template>
</el-dialog>

</template>

<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { getAvailableWorkflowApi, getFormPropsApi, taskFormJsonGetApi } from 'dp-api'
const state = reactive({
    availableWorkflow: [],
    formDialogVisible: false,
    selectedWorkflow: {}
})
async function getAvailableWorkflow () {
    state.availableWorkflow = await getAvailableWorkflowApi()
}
async function workflowClickHandler (item: Workflow) {
    state.formDialogVisible = true
    state.selectedWorkflow = deepCopy(item)
    initForm(item.key)
    // createWorkflowForm.value = await workflowStore.getFromProperties(item.key)

    // opened.value = true

    // // vform
    // const formData = await formInit(createWorkflowForm.value)
    // const formJson = await handleTaskFormJsonGet(selectedWorkflow.value)
    // VformRenderRef.value.setFormDataAndJson(formJson, formData, createWorkflowForm.value)
}
// #region module: vform
    const vFormRef = ref()
    function checkAndSubmit () {
        const data = vFormRef.value.getFormData()
        console.log({data})
    }
    async function initForm (processKey) {
        const props = await getFormPropsApi({ processKey })
        const formData = formDataGet(props)
        const formJson = await formJsonGet('start', processKey)
        setTimeout(() => {
            vFormRef.value.setForm(formJson, formData)
        })
    }
    function formDataGet (propList) {
        return propList.reduce((prev, item) => {
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
// #endregion
onMounted(() => {
    getAvailableWorkflow()
})
</script>
<style lang="scss" scoped>
</style>
