
<script lang="ts" setup>
import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser';
import { Graph, Node } from '@antv/x6'

///#region setup
    const props = defineProps({
        bpmn: {
            type: String,
            default: ""
        }
    });
    const parser = new XMLParser( { 
            ignoreAttributes: false,
            attributeNamePrefix : "attr_",
            cdataPropName:     "__cdata",
            allowBooleanAttributes: true,
            parseAttributeValue: true
        });
    const builder = new XMLBuilder(
        { 
            ignoreAttributes: false,
            attributeNamePrefix : "attr_",
            cdataPropName:     "__cdata",
            allowBooleanAttributes: true,
            suppressBooleanAttributes: false
        }
    );

    const { bpmn } = toRefs(props);
    const data = ref();
    const graph = ref<Graph>();
    const tooltip = ref('')
    const sidePanelOpened = ref(false);
    const selectedData = ref();
    const workflowForm = ref();
    // 如果props.bpmn有值，就转换成 js 对象
    onMounted(() => {
        bpmnToJs();

    })

///#endregion setup

/// #region antV6
const {generateMap} = useGraph('editorContainer');

/// #endregion antV6

function bpmnToJs() {
    const tempD = parser.parse(props.bpmn, );

    if(tempD['?xml']){
        delete tempD['?xml'];
    }
    data.value = tempD;
    const graphData = bpmnToX6(data.value,{hideEnd:false});
    initForm();
    graph.value = generateMap(graphData);
    graph.value.on('node:dblclick',({node}) => {
        dblClickHandler(node)
    })
    graph.value.on('node:mouseenter',({e, node}) => {
        showTooltip(e, node);
    })
    graph.value.on('node:mouseleave',() => {
        hideTooltip();
    })
    // data.value = convert.xml2js(props.bpmn, { compact: true, spaces: 4 });
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

function showTooltip(e:MouseEvent, node:Node) {
    const data = node.getData();
    if(data && data.attr_name === undefined){
        return;
    }
    tooltip.value = data.attr_name || "";
    const {clientX, clientY} = e;
    const toolTipsContainer = document.querySelector('.toolTipsContainer') as HTMLElement;
    toolTipsContainer.style.left = `${clientX - 60}px`;
    toolTipsContainer.style.top = `${clientY - 40}px`;
    toolTipsContainer.style.display = 'block';
}

function hideTooltip() {
    const toolTipsContainer = document.querySelector('.toolTipsContainer') as HTMLElement;
    toolTipsContainer.style.display = 'none';
}


function dblClickHandler(node:Node) {
    const data = node.getData();
    console.log(node, data);
    if(data.type === 'userTask'){
        // open dialog
        sidePanelOpened.value = true;
        selectedData.value = data;
    }
    if(data.type === 'serviceTask'){
      console.log('selectedData', data)
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
  console.log(stepData, 'stepData')
    const newData = {...stepData};
    // find step in data
    delete newData.type;
    setStepData(stepData.attr_id, newData);

    // update graph
    const node = graph.value?.getCellById(stepData.attr_id);
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
    const node = graph.value?.getCellById(stepData.attr_id);
    if(node){
        node.setAttrs({
            label: {
                text: stepData.attr_name
            }
        })
        node.setData(newData);
    }
}

function jsToBpmn() {
    const xml = builder.build(data?.value);
    // create blob file
    const blob = new Blob([xml], {type: "text/xml;charset=utf-8"});
    // add blob to form data
    const formData = new FormData();
    formData.append('file', blob, 'workflow.bpmn.xml');
    formData.append('name', data.value.definitions.process.attr_name);
    formData.append('key', data.value.definitions.process.attr_id);
  
}
function getWorkflowData () {
    const xml = builder.build(data?.value);
    // create blob file
    const blob = new Blob([xml], {type: "text/xml;charset=utf-8"});
    const name = data.value.definitions.process.attr_name
    const key = data.value.definitions.process.attr_id
    return {
        blob, name, key
    }
}
function createEmptyData(){
    data.value = {};
}

defineExpose({
    bpmnToJs,
    jsToBpmn,
    getWorkflowData
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
        
        <div id="editorContainer"></div>
        <div v-if="data" class="footer">
            <div class="name">
                {{ data.definitions.process.attr_name }}
                <ElButton type="primary" @click="editInfo">edit info</ElButton>
            </div>
            <div class="actions">
                <slot name="actions"></slot>
            </div>
            <!-- <button @click="jsToBpmn">jsToBpmn</button>
            <button @click="bpmnToJs">bpmnToJs</button>
            <button @click="createEmptyData">createEmptyData</button> -->
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
