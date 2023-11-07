<script lang="ts" setup>
import {bpmnToX6, bpmnToJson} from "../../utils/graphHelper";
import {Node} from "@antv/x6";
import {jsonToBpmn} from "../../utils/graphHelper";
import {useWorkflowGraph} from "../../composables/useWorkflowGraph";

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
    console.log(e)
  }
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
  // create blob file
  const blob = new Blob([xml], {type: "text/xml;charset=utf-8"});
  const name = bpmnJson.value.definitions.process.attr_name
  const key = bpmnJson.value.definitions.process.attr_id
  return {
    blob, name, key
  }
}


defineExpose({
  getWorkflowData,
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
      </template>
    </div>
    <GraphViewer
        v-if="graphJson"
        ref="graphEl"
        :graphJson="graphJson"
        @node:dblclick="dblClickHandler"
        @edge:dblclick="edgeDblClickHandler"
    ></GraphViewer>

    <div v-if="bpmnJson" class="footer">
      <div class="name">
        {{ bpmnJson.definitions.process.attr_name }} : {{ bpmnJson.definitions.process.attr_template }}
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