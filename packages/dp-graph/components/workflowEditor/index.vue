<script lang="ts" setup>
import {bpmnToX6, bpmnToJson} from "../../utils/graphHelper";
import {Node} from "@antv/x6";
import {jsonToBpmn} from "../../utils/graphHelper";
import {useWorkflowGraph} from "../../composables/useWorkflowGraph";
import {workflowTemplateList} from "../../utils/workflowTemplate";
import {useEventListener} from '@vueuse/core';
import {removeAllConnection, removeAndJoinNextNode} from "../../utils/graphNodeHelper";
import {ElMessage} from 'element-plus'
import {bpmnStepToForm} from "../../utils/formEditorHelper";
const props = defineProps<{
  bpmn: String
}>()
const emit = defineEmits(['resetTemplate'])
const sidePanelOpened = ref(false);
const tooltip = ref('')
const selectedData = ref();
const workflowForm = ref();
const graphEl = ref();

const { graphJson, bpmnJson, allFormField } = useWorkflowGraph();
function setupGraph() {
  graphJson.value = bpmnToX6(props.bpmn, { hideEnd:false });
  bpmnJson.value = bpmnToJson(props.bpmn);
}


function edgeDblClickHandler({edge, e}:any) {
  console.log("edge click", edge)
  const data = edge.getData();
  if(data.type === 'boundaryEvent'){
    const data = edge.getData();
    selectedData.value = data;
    sidePanelOpened.value = true;
  }
}

function saveBoundaryStep(date){
  
  
  if(Array.isArray(bpmnJson.value.definitions.process.boundaryEvent)){
    const item = bpmnJson.value.definitions.process.boundaryEvent.find(item => item.attr_id === date.attr_id);
    if(item){
      item.timerEventDefinition.timeDuration = date.timerEventDefinition.timeDuration;
    }
  }else{
    bpmnJson.value.definitions.process.boundaryEvent.timerEventDefinition.timeDuration = date.timerEventDefinition.timeDuration;
  }
  console.log(bpmnJson.value.definitions.process.boundaryEvent)
}

function dblClickHandler({node}:Node) {
  console.log("node click", node)
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

function resetTemplate() {
  emit('resetTemplate', bpmnJson.value.definitions.process)
}

function saveForm(updatedData:any) {
  bpmnJson.value.definitions.process.attr_name = updatedData.attr_name;
  bpmnJson.value.definitions.process.attr_id = updatedData.attr_name.trim().replaceAll(' ', '');
  if(updatedData['attr_flowable:candidateStarterGroups']) {
    bpmnJson.value.definitions.process['attr_flowable:candidateStarterGroups'] = updatedData['attr_flowable:candidateStarterGroups'];
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
    // IMPORTANT: update selectedData to update form otherwise , form will not update
    const dd = node.getData();
    selectedData.value = dd;
  }

}



function setStepData(stepId, newData) {

  // if startEvent id === stepId
  if(bpmnJson.value?.definitions?.process?.startEvent?.attr_id === stepId){
    bpmnJson.value.definitions.process.startEvent = {
      ...bpmnJson.value?.definitions?.process?.startEvent,
      ...newData
    }
    return;
  }
  if(Array.isArray(bpmnJson.value?.definitions?.process.userTask)) {
    const index = bpmnJson.value?.definitions?.process.userTask.findIndex(item => item.attr_id === stepId);
    if(index > -1){
      bpmnJson.value.definitions.process.userTask[index] = newData
      
      return;
    }
  }else{
    if(bpmnJson.value?.definitions?.process.userTask?.attr_id === stepId){
      bpmnJson.value.definitions.process.userTask = newData
      console.log('setStepData', bpmnJson.value.definitions.process.userTask)
      return;
    }
  }
  if(Array.isArray(bpmnJson.value?.definitions?.process.serviceTask)) {
    const index = bpmnJson.value?.definitions?.process.serviceTask.findIndex(item => item.attr_id === stepId);
    if(index > -1){
      bpmnJson.value.definitions.process.serviceTask[index] = newData
      return;
    }
  }else{
    if(bpmnJson.value?.definitions?.process.serviceTask?.attr_id === stepId){
      bpmnJson.value.definitions.process.serviceTask = newData
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

function getWorkflowData() {
  
  const xml = jsonToBpmn(bpmnJson.value)
  console.log(bpmnJson.value)
  // create blob file
  const blob = new Blob([xml], {type: "text/xml;charset=utf-8"});
  const name = bpmnJson.value.definitions.process.attr_name
  const key = bpmnJson.value.definitions.process.attr_id
  return {
    blob, name, key
  }
}

function nodeRightClickHandler({e, node}:any) {
  e.preventDefault();
  const data = node.getData();
  console.log('right click', node)
  // 如果 node 是 userTask, 
}

const displayTemplate = computed(() => {
  if(bpmnJson.value?.definitions?.attr_workflowTemplate){
    
    return workflowTemplateList.find(item => item.id === bpmnJson.value?.definitions?.attr_workflowTemplate)?.name
  }
  return workflowTemplateList[0].name

})



function itemDeleteHandler(node:Node) {
  
  // step 1 show confirm dialog
  // show alert
  const confirmDelete = confirm("Are you sure you want to delete this step?");
  if(!confirmDelete) return;

  const data = node.getData();
  const itemToDelete = [];
  if(data.type === 'userTask'){
    return;
    // find step in data
    if(Array.isArray(bpmnJson.value?.definitions?.process.userTask)) {
      const index = bpmnJson.value?.definitions?.process.userTask.findIndex(item => item.attr_id === data.attr_id);
      if(index > -1){
        bpmnJson.value.definitions.process.userTask.splice(index, 1);
      }
    }else{
      if(bpmnJson.value?.definitions?.process.userTask?.attr_id === data.attr_id){
        bpmnJson.value.definitions.process.userTask = undefined;
      }
    }
    // get connected node
    removeAllConnection(node, graphEl.value?.graph);
    // remove all edge related to this step
    const items = bpmnJson.value.definitions.process.sequenceFlow.filter(item => item.attr_sourceRef === data.attr_id || item.attr_targetRef === data.attr_id);
    
  }
  
  if(data.type === 'serviceTask') {
    // find step in data
    if(Array.isArray(bpmnJson.value?.definitions?.process.serviceTask)) {
      const index = bpmnJson.value?.definitions?.process.serviceTask.findIndex(item => item.attr_id === data.attr_id);
      if(index > -1){
        itemToDelete.push(bpmnJson.value.definitions.process.serviceTask[index])
        bpmnJson.value.definitions.process.serviceTask.splice(index, 1);
      }
    }else{
      if(bpmnJson.value?.definitions?.process.serviceTask?.attr_id === data.attr_id){
        itemToDelete.push(bpmnJson.value.definitions.process.serviceTask)
        bpmnJson.value.definitions.process.serviceTask = undefined;
      }
    }
    const otherToNode = bpmnJson.value.definitions.process.sequenceFlow.find(item => item.attr_targetRef === data.attr_id);
    const nodeToOther = bpmnJson.value.definitions.process.sequenceFlow.find(item => item.attr_sourceRef === data.attr_id);
    console.log(otherToNode, nodeToOther)
    // link other node attr_sourceRef to nodeToOther.attr_targetRef
    if(otherToNode && nodeToOther){
      otherToNode.attr_targetRef = nodeToOther.attr_targetRef ;
    }
    // remove nodeToOther
    if(nodeToOther){
      const index = bpmnJson.value.definitions.process.sequenceFlow.findIndex(item => item.attr_id === nodeToOther.attr_id);
      if(index > -1){
        bpmnJson.value.definitions.process.sequenceFlow.splice(index, 1);
      }
    }
    // removeAndJoinNextNode(node, graphEl.value?.graph);
    graphJson.value = bpmnToX6(bpmnJson.value, { hideEnd:false });
  }

 
}


async function validateForm():Promise<any[]>{
  const userTask = bpmnJson.value.definitions.process.userTask;
  const startEvent = bpmnJson.value.definitions.process.startEvent;
  const allStep = [];
  if(userTask){
    if(Array.isArray(userTask)){
      allStep.push(...userTask)
    }else{
      allStep.push(userTask)
    }
  }
  if(startEvent){
    allStep.push(startEvent)
  }
  // Loop allStep and check all field in extensionElements['flowable:formProperty'] is valid

  const params:any[] = [];
  for(const step of allStep) {
    const valid = step.extensionElements['flowable:formProperty'].reduce((acc, cur) => {
      if(!cur.attr_field_valid) acc = false;
      return acc;
    }, true)
    if(!valid) {
      ElMessage.error('Please fix all field error before preview')
      throw new Error();
    }
    const formJson = bpmnStepToForm(step.extensionElements['flowable:formProperty'], bpmnJson.value.definitions.process)
    const param = {
      processKey: bpmnJson.value.definitions.process.attr_id,
      userTaskId: step.attr_id,
      jsonValue: JSON.stringify(formJson)
    }
    params.push(param);
    // TODO : upload formJson to server and get response
  }
  return params;
  
}





function itemAddHandler(node:Node) {
  console.log('add', node)
}
useEventListener(document, 'delete-workflow-graph-item', ({detail:{node}}) => itemDeleteHandler(node))
useEventListener(document, 'add-workflow-graph-item', ({detail:{node}}) =>itemAddHandler(node))
defineExpose({
  getWorkflowData,
  validateForm,
})
</script>

<template>
  <div class="editorContainer">
    <div  class="toolTipsContainer">
      {{ tooltip }}
    </div>
    <div :class="{sidePanelContainer:true , sidePanelOpened}">
      <template v-if="selectedData">
        <WorkflowEditorForm v-if="selectedData.type === 'workflowForm'"  @close="closeSidePanel" @submit="saveForm" />
        <WorkflowEditorFormUserTask v-else-if="selectedData.type === 'userTask'" :data="selectedData"  @close="closeSidePanel" @submit="saveUserStep" />
        <WorkflowEditorFormEmail v-else-if="selectedData['attr_flowable:delegateExpression'] === '${sendNotificationDelegate}'" :data="selectedData" :allField="allFormField.form" @close="closeSidePanel" @submit="saveEmailStep" />
        <WorkflowEditorFormDocument v-else-if="selectedData['attr_flowable:delegateExpression'] === '${generateDocumentDelegate}'" :data="selectedData" :allField="allFormField.form" @close="closeSidePanel" @submit="saveEmailStep" />
        <WorkflowEditorFormBoundaryEvent v-else-if="selectedData.type === 'boundaryEvent'" :data="selectedData" @close="closeSidePanel" @submit="saveBoundaryStep" />
      </template>
    </div>
    <GraphViewer
        v-if="graphJson"
        ref="graphEl"
        :graphJson="graphJson"
        @node:dblclick="dblClickHandler"
        @edge:dblclick="edgeDblClickHandler"
        @node:contextmenu="nodeRightClickHandler"
    ></GraphViewer>

    <div v-if="bpmnJson" class="footer">
      <div class="name">
        {{ bpmnJson.definitions.process.attr_name }} : {{ displayTemplate }}
        <ElButton type="primary" @click="editInfo">edit info</ElButton>
        <ElButton type="primary" @click="resetTemplate">reset template</ElButton>
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
  background: var(--color-grey-0000);
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
  background-color: var(--color-grey-0000);
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