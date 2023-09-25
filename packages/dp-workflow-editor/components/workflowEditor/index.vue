
<script lang="ts" setup>
import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser';
import { Graph, Node } from '@antv/x6'
import {useGraph} from '../../composables/userGraph';
import { bpmnToX6 } from '../../utils/graphHelper';
import {ServiceNode} from '../../utils/graphNode';



// register node
ServiceNode
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
    // 如果props.bpmn有值，就转换成 js 对象
    onMounted(() => {
        bpmnToJs();
    })
///#endregion setup

/// #region antV6
const {generateMap} = useGraph('editorContainer');

/// #endregion antV6

function bpmnToJs() {
    const tempD = parser.parse(props.bpmn);

    if(tempD['?xml']){
        delete tempD['?xml'];
    }
    data.value = tempD;
    const graphData = bpmnToX6(data.value);
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
    const allField:any = {};
    // startEvent form
    const startEvent = process?.startEvent;
    if(startEvent){
        const form = getForm(startEvent);
        form.forEach(item => {
            allField[item.attr_id] = item;
        })
    }
    // userTask form
    const userTask = Array.isArray(process?.userTask) ? process?.userTask : [process?.userTask];
    userTask.forEach(item => {
        const form = getForm(item);
        form.forEach(item => {
            allField[item.attr_id] = item;
        })
    })

    console.log(allField)
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
    if(data.attr_name === undefined){
        return;
    }
    tooltip.value = data.attr_name || "";
    const {clientX, clientY} = e;
    const toolTipsContainer = document.querySelector('.toolTipsContainer') as HTMLElement;
    toolTipsContainer.style.left = `${clientX}px`;
    toolTipsContainer.style.top = `${clientY}px`;
    toolTipsContainer.style.display = 'block';
}

function hideTooltip() {
    const toolTipsContainer = document.querySelector('.toolTipsContainer') as HTMLElement;
    toolTipsContainer.style.display = 'none';
}


function dblClickHandler(node:Node) {
    const data = node.getData();
    
    if(data.type === 'userTask'){
        console.log(data)
        // open dialog
        sidePanelOpened.value = true;
        selectedData.value = data;
        console.log(selectedData.value)
    }
    if(data.type === 'serviceTask'){
        console.log(data)
        // open dialog
        sidePanelOpened.value = true;
        selectedData.value = data;
        
    }
}

function closeSidePanel() {
    sidePanelOpened.value = false;
}

function saveForm(updatedData:any) {

}


function jsToBpmn() {
    const xml = builder.build(data?.value);
    // add xml header

    // {
    //     file: Blob,
    //     name: string,
    //     key: string,
    //     emailTemplate: string /// 123,34455,555
    //     documentTemplate: string // sprint 13 
    // }
}

function createEmptyData(){
    data.value = {};
}

defineExpose({
    bpmnToJs,
    jsToBpmn,
})


</script>

<template>
    <div class="editorContainer">
        <div  class="toolTipsContainer">
            {{ tooltip }}
        </div>
        <div v-if="selectedData" :class="{sidePanelContainer:true , sidePanelOpened}">
            <WorkflowEditorForm v-if="selectedData.type === 'workflowForm'" :data="selectedData" @close="closeSidePanel" @submit="saveForm" />
            <WorkflowEditorUserTaskForm v-if="selectedData.type === 'userTask'" :data="selectedData" @close="closeSidePanel" @submit="saveForm" />
        </div>
        
        <div id="editorContainer"></div>
        <div class="footer">
            <button @click="jsToBpmn">jsToBpmn</button>
            <button @click="bpmnToJs">bpmnToJs</button>
            <button @click="createEmptyData">createEmptyData</button>
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
