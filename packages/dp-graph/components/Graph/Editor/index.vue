<script lang="ts" setup>
import {bpmnToX6} from "../../../utils/graphHelper";
import {Node} from "@antv/x6";

const props = defineProps<{
  bpmn: String
}>()

const graphJson = ref();
const sidePanelOpened = ref(false);
const tooltip = ref('')
const selectedData = ref();
const workflowForm = ref();
const graphEl = ref();
const data = ref();
function setupGraph() {
  graphJson.value = bpmnToX6(props.bpmn, {hideEnd:false});
  data.value = bpmnToJson(props.bpmn);
  initForm();
}

function initForm() {
  const process = data.value?.definitions?.process;
  const form:any = {};
  // startEvent form
  const startEvent = process?.startEvent;
  if(startEvent){
    const formItem = getForm(startEvent);
    formItem.forEach(item => {
      form[item.attr_id] = item;
    })
  }
  // userTask form
  const userTask = Array.isArray(process?.userTask) ? process?.userTask : [process?.userTask];
  userTask.forEach(item => {
    const formItem = getForm(item);
    formItem.forEach(item => {
      form[item.attr_id] = item;
    })
  })
  workflowForm.value = {
    attr_name: process?.attr_name,
    attr_id: process?.attr_id,
    ['attr_flowable:candidateStarterGroups']: process?.['attr_flowable:candidateStarterGroups'],
    form
  };
}


function getForm(item):any[] {
  if(item.extensionElements){
    const form = item.extensionElements['flowable:formProperty'];
    if(form){
      return form;
    }
  }
  return [];
}
function dblClickHandler({node}:Node) {
  const data = node.getData();
  if(data.type === 'userTask'){
    // open dialog
    sidePanelOpened.value = true;
    selectedData.value = data;
  }
  if(data.type === 'serviceTask'){
    // open dialog
    sidePanelOpened.value = true;
    selectedData.value = data;

  }
}
function editInfo() {
  sidePanelOpened.value = true;
  selectedData.value = {
    type: 'workflowForm',
  };
}
function closeSidePanel() {

  sidePanelOpened.value = false;
}

function saveForm(updatedData:any) {
  data.value.definitions.process.attr_name = updatedData.attr_name;
  data.value.definitions.process.attr_id = updatedData.attr_name.trim().replaceAll(' ', '');
  if(updatedData['attr_flowable:candidateStarterGroups']) {
    data.value.definitions.process['attr_flowable:candidateStarterGroups'] = updatedData['attr_flowable:candidateStarterGroups'];
  }
  workflowForm.value = updatedData;
}

function saveUserStep(stepData) {
  const newData = {...stepData};
  // find step in data
  delete newData.type;
  setStepData(stepData.attr_id, newData);

  // update graph
  const node = graphEl.value?.graph.getCellById(stepData.attr_id);
  if(node){
    node.setAttrs({
      label: {
        text: stepData.attr_name
      }
    })
    node.setData(newData);
  }

}


function setStepData(stepId, newData) {

  // if startEvent id === stepId
  if(data.value?.definitions?.process?.startEvent?.attr_id === stepId){
    data.value.definitions.process.startEvent = {
      ...data.value?.definitions?.process?.startEvent,
      ...newData
    }
    return;
  }
  if(Array.isArray(data.value?.definitions?.process.userTask)) {
    const index = data.value?.definitions?.process.userTask.findIndex(item => item.attr_id === stepId);
    if(index > -1){
      data.value.definitions.process.userTask[index] = newData
      return;
    }
  }else{
    if(data.value?.definitions?.process.userTask?.attr_id === stepId){
      data.value.definitions.process.userTask = newData
      return;
    }
  }
  if(Array.isArray(data.value?.definitions?.process.serviceTask)) {
    const index = data.value?.definitions?.process.serviceTask.findIndex(item => item.attr_id === stepId);
    if(index > -1){
      data.value.definitions.process.serviceTask[index] = newData
      return;
    }
  }else{
    if(data.value?.definitions?.process.serviceTask?.attr_id === stepId){
      data.value.definitions.process.serviceTask = newData
      return;
    }
  }
}

function saveEmailStep(stepData) {
  const newData = {...stepData};
  // find step in data
  delete newData.type;
  setStepData(stepData.attr_id, newData);

  // update graph
  const node = graphEl.value.graph.value?.getCellById(stepData.attr_id);
  if(node){
    node.setAttrs({
      label: {
        text: stepData.attr_name
      }
    })
    node.setData(newData);
  }
}

onMounted(() => {
  setupGraph();
})

watch(() => props.bpmn, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    setupGraph();
  }
})

</script>

<template>
  <div class="editorContainer">
    <div  class="toolTipsContainer">
      {{ tooltip }}
    </div>
    <div :class="{sidePanelContainer:true , sidePanelOpened}">
      <template v-if="selectedData">
        <WorkflowEditorForm v-if="selectedData.type === 'workflowForm'" :data="workflowForm" @close="closeSidePanel" @submit="saveForm" />
        <WorkflowEditorUserTaskForm v-else-if="selectedData.type === 'userTask'" :data="selectedData" :allField="workflowForm.form" @close="closeSidePanel" @submit="saveUserStep" />
        <WorkflowEditorEmailForm v-else-if="selectedData['attr_flowable:delegateExpression'] === '${sendNotificationDelegate}'" :data="selectedData" :allField="workflowForm.form" @close="closeSidePanel" @submit="saveEmailStep" />
        <WorkflowEditorDocumentForm v-else-if="selectedData['attr_flowable:delegateExpression'] === '${generateDocumentDelegate}'" :data="selectedData" :allField="workflowForm.form" @close="closeSidePanel" @submit="saveEmailStep" />
      </template>
    </div>
    <GraphViewer 
        v-if="graphJson"
        ref="graphEl" 
        :graphJson="graphJson" 
        @node:dblclick="dblClickHandler"
    ></GraphViewer>
    
    <div v-if="data" class="footer">
      <div class="name">
        {{ data.definitions.process.attr_name }}
        <ElButton type="primary" @click="editInfo">edit info</ElButton>
      </div>
      <div class="actions">
        <slot name="actions"></slot>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.editorContainer{
  width: 100%;
  height:100%;
  position: relative;
  overflow: hidden;
}
.viewerContainer{
  width: 100%;
  height: 100%;
}
#editorContainer{
  width: 100%;
  height:100%;
}

.footer{
  position: absolute;
  width:100%;
  bottom: 0px;
  left: 0px;
  z-index: 2;
  background: #fff;
  padding: var(--app-padding);
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-content: center;
  .name{
    flex: 1 0 auto;
    font-size: 1.2rem;
    font-weight: bold;
    display: flex;
    flex-flow: row nowrap;
    gap: var(--app-padding);
  }
}

.toolTipsContainer{
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0 0 5px #ccc;
  display: none;
  z-index: 2;
  font-size: 0.8rem;
  max-width: 120px;;
}

.sidePanelContainer{
  position: absolute;
  right: 0;
  top: 0;

  height: 100%;
  background-color: #fff;
  border-left: 1px solid #ccc;
  box-shadow: 0 0 5px #ccc;
  z-index: 3;
  transition: all 0.3s ease-in-out;
  transform: translateX(100%);
  &.sidePanelOpened{
    transform: translateX(0);
  }
}

</style>