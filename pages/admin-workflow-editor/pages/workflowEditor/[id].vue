<template>
<NuxtLayout class="fit-height" backPath="/workflowEditor" :pageTitle="id === 'new' ? $t('workflowEditor.custom') : state.detail?.name">
    <div class="pageContainer">
        <WorkflowEditor v-if="bpmnFile" ref="WorkflowEditorRef" :bpmn="bpmnFile" @resetTemplate="resetTemplate">
            <template #actions>
                <template v-if="state.newStatus">
                    <el-button :loading="state.loading" type="primary" @click="handelCreate">{{$t('workflowEditor.add')}}</el-button>
                </template>
                <template v-else>
                    <el-button :loading="state.loading" type="primary" @click="handleSave(true)">{{$t('button.saveDraft')}}</el-button>
                    <el-button :loading="state.loading" :disabled="state.detail.status === 'A'" type="primary" @click="handleSave(false)">{{$t('button.publish')}}</el-button>
                </template>
            </template>
        </WorkflowEditor>
    </div>
</NuxtLayout>
</template>

<script lang="ts" setup>
import {
  ValidateWorkflowXMLApi,
  UploadWorkflowApi,
  GetWorkflowDraftXMLApi,
  GetWorkflowDraftDetailApi,
  SaveTaskFormJsonApi
} from 'dp-api'

import { reactive } from 'vue';
const router = useRouter()
const bpmnFile = ref("");
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
async function getXMLFileTemplate(template:string = 'Single') {
    const item = workflowTemplateList.find((item) => item.id === template)
    const templatePath = item.url
    const response = await fetch(templatePath);
    return await response.text() as string;
    
}

async function createNewWorkflow () {
  const {template, name} = route.query as any
  const text = await getXMLFileTemplate(template)
  const timestamp = new Date().getTime();
  const nameToId = name.toLowerCase().replaceAll(' ', '_') + '_' + timestamp;
  bpmnFile.value = text.replaceAll('workflowId', nameToId).replaceAll('workflowName', name)
}
async function handleSave(isDraft: boolean = true) {

    const formRequest = await WorkflowEditorRef.value.validateForm()
    if(!state.detail.draftId) return
    console.log("handleSave")
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
        if(!isDraft){
          
          await Promise.all(formRequest.map((param) => {
            return SaveTaskFormJsonApi(param)
          }))
        }
    } catch (error) {
      console.log(error)
    }
    
    state.loading = false
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
      console.log(error)
    }
    setTimeout(() => {
        state.loading = false
    }, 200)
}
async function resetTemplate(template) {
  const text = await getXMLFileTemplate(template.attr_template || 'Single' );
  bpmnFile.value = text.replaceAll('workflowId', template.attr_id).replaceAll('workflowName', template.attr_name)
}

onMounted(() => {
    const id = route.params.id
    if(id === 'new') {
        state.newStatus = true
        createNewWorkflow()
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