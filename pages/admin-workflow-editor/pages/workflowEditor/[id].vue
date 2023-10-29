<template>
<NuxtLayout class="fit-height" backPath="/workflowEditor" :pageTitle="id === 'new' ? $t('workflowEditor.custom') : state.detail?.name">
    <div class="pageContainer">
        <GraphEditor v-if="bpmnFile" ref="WorkflowEditorRef" :bpmn="bpmnFile">
            <template #actions>
                <template v-if="state.newStatus">
                    <el-button :loading="state.loading" type="primary" @click="handelCreate">{{$t('workflowEditor.add')}}</el-button>
                </template>
                <template v-else>
                    <el-button :loading="state.loading" type="primary" @click="handleSave(true)">{{$t('button.saveDraft')}}</el-button>
                    <el-button :loading="state.loading" :disabled="state.detail.status === 'A'" type="primary" @click="handleSave(false)">{{$t('button.publish')}}</el-button>
                </template>
            </template>
        </GraphEditor>
    </div>
</NuxtLayout>
</template>

<script lang="ts" setup>
import { ValidateWorkflowXMLApi, UploadWorkflowApi, GetWorkflowDraftXMLApi, GetWorkflowDraftDetailApi } from 'dp-api'
import { reactive } from 'vue';
const router = useRouter()
const bpmnFile = ref();
const WorkflowEditorRef = ref()
const state = reactive({
    detail: {},
    loading: false,
    newStatus: false
})
const route = useRoute()
async function getDetail(id: string) {
    state.detail = await GetWorkflowDraftDetailApi(id)
}
async function getXML(id: string) {
    const blob = await GetWorkflowDraftXMLApi(id)
    const file = await blob.text()
    bpmnFile.value = file
}
async function getXMLFileTemplate() {
    const template = route.query.template
    const singleFilePath = "/bpmn/single.xml";
    const multipleFilePath = "/bpmn/multiple.xml";
    const templatePath = template === 'Single' ? singleFilePath : multipleFilePath
    const response = await fetch(templatePath);
    const text = await response.text();
    const timestamp = new Date().getTime();
    templatePath === 'Single' ? text.replaceAll('singleApprovalDemo', `singleApprovalDemo_${timestamp}`) : text.replaceAll('multipleApprovalDemo', `multipleApprovalDemo_${timestamp}`)
    bpmnFile.value = text
}
async function handleSave(isDraft: boolean = true) {
    // const formData1 = new FormData();
    // formData1.append('file', WorkflowEditorRef.value.getBlob(), 'workflow.bpmn.xml')
    // await ValidateWorkflowXMLApi(formData1)
    if(!state.detail.draftId) return
    state.loading = true
    try {
        const { blob, name, key } = WorkflowEditorRef.value.getWorkflowData()
        const formData = new FormData();
        formData.append('name', name)
        formData.append('key', key)
        formData.append('draftId', state.detail.draftId)
        formData.append('file', blob, 'workflow.bpmn.xml')
        formData.append('isDraft', isDraft)
        state.detail = await UploadWorkflowApi(formData)
    } catch (error) {
    }
    setTimeout(() => {
        state.loading = false
    }, 200)
}
async function handelCreate() {
    state.loading = true
    try {
        const { blob, name, key } = WorkflowEditorRef.value.getWorkflowData()
        const formData = new FormData();
        formData.append('name', name)
        formData.append('key', key)
        formData.append('file', blob, 'workflow.bpmn.xml')
        formData.append('isDraft', true)
        state.detail = await UploadWorkflowApi(formData)
        console.log(state.detail, 'handelCreate');
        
        router.push(`/workflowEditor/${state.detail.draftId}`)
        // router.go(0)
    } catch (error) {
    }
    setTimeout(() => {
        state.loading = false
    }, 200)
}


onMounted(() => {
    const id = route.params.id
    if(id === 'new') {
        state.newStatus = true
        getXMLFileTemplate()
    } else {
        getDetail(id)
        getXML(id)
    }
})

</script>

<style >
.pageContainer{
    width:100%;
    height: 100%;
    overflow: hidden;
}
</style>