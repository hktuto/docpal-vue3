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
  <ElTabs v-if="!state.loading" v-model="activeName">
    <ElTabPane :label="$t('workflow_form')" name="Form">
      <WorkflowDetailFormRender ref="vFormRef" />
    </ElTabPane>
    <ElTabPane :label="$t('workflow_graph')"  name="Graph">
      <WorkflowDetailGraph v-if="activeName === 'Graph'"  ref="graph" :process-key="state.selectedWorkflow.key" step="start"/>
    </ElTabPane>
  </ElTabs>


    <template #footer>
        <el-button v-if="activeName === 'Form'" :loading="state.loading" @click="checkAndSubmit">{{$t('workflow_startWorkflow')}}</el-button>
    </template>
</el-dialog>

</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import {
    getAvailableWorkflowApi,
    getFormPropsApi,
    taskFormJsonGetApi,
    workflowProcessStartApi } from 'dp-api'
const emits = defineEmits(['created']);
const activeName = ref('Form')
const state = reactive({
    availableWorkflow: [],
    formDialogVisible: false,
    selectedWorkflow: {},
    loading: false
})

const modelProps = ref('form')
function tabChange(tab: any, event: Event) {
    modelProps.value = tab.paneName
}
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
    async function checkAndSubmit () {
        const data = await vFormRef.value.getFormData()
        if(data) {
            const form = {
                processKey: state.selectedWorkflow.key,
                businessKey: data.businessKey || "",
                properties: Object.entries(data).reduce((newObj, [key, val]) => {
                    if (val || val === false) newObj[key]= val
                    return newObj;
                },{}),
            }
            state.loading = true
            try {
                await workflowProcessStartApi(form)
                state.formDialogVisible = false
                ElMessage.success('Workflow created')
                emits('created')
            } catch (error) {

            }
        }
        state.loading = false
    }
    async function initForm (processKey) {
        const props = await getFormPropsApi({ processKey })
        const formData = formDataGet(props)
        const formJson = await formJsonGet('start', processKey)
        setTimeout(() => {
            vFormRef.value.setForm(formJson, formData, props)
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
        if (!response[0] ||
            response[0] && !response[0].jsonValue) return {}
        return JSON.parse(response[0].jsonValue)
    }
// #endregion
onMounted(() => {
    getAvailableWorkflow()
})
</script>
<style lang="scss" scoped>
</style>
