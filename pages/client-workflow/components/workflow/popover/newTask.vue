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
<component :is="state.selectedWorkflow.component" v-if="state.selectedWorkflow.component"  v-bind="$props" @close="state.selectedWorkflow = {}"  />
<el-dialog v-else v-model="state.formDialogVisible" :title="state.selectedWorkflow.name"
    destroy-on-close append-to-body width="60%"
    :close-on-click-modal="false"
    class="scroll-dialog"
    >
    <WorkflowDetailGraph :process-key="state.selectedWorkflow.key" step="start"/>
    <WorkflowDetailFormRender ref="vFormRef" />
    <template #footer>
        <el-button :loading="state.loading" @click="checkAndSubmit">{{$t('workflow_startWorkflow')}}</el-button>
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
const state = reactive({
    availableWorkflow: [] as any[],
    formDialogVisible: false,
    selectedWorkflow: {} as any,
    loading: false
})
async function getAvailableWorkflow () {
    const allWorkflow = await getAvailableWorkflowApi();
    //@ts-ignore
    const customWorkflow = window.extraWorkflow || [];
    state.availableWorkflow = [...allWorkflow, ...customWorkflow];
    console.log(state.availableWorkflow);
}
async function workflowClickHandler (item:any) {
    console.log('workflow change', item)
    if(item.component) {
        state.selectedWorkflow = item
        return
    }
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
                    if (val) newObj[key]= val
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
