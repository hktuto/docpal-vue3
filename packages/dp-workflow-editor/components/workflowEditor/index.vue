
<script lang="ts" setup>
import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser';
import { Graph, Node } from '@antv/x6'
import {useGraph} from '../../composables/userGraph';
import { bpmnToX6 } from '../../utils/graphHelper';
import {ServiceNode, userNode} from '../../utils/graphNode';

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
    // 如果props.bpmn有值，就转换成 js 对象
    onMounted(() => {
        bpmnToJs();
    })
///#endregion setup

/// #region antV6
const {generateMap} = useGraph('editorContainer');

/// #endregion antV6

function bpmnToJs() {
    const tempD = parser.parse(props.bpmn,);

    if(tempD['?xml']){
        delete tempD['?xml'];
    }
    data.value = tempD;
    const graphData = bpmnToX6(data.value);
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
        // open dialog
    
    }
}

function jsToBpmn() {
    const xml = builder.build(data?.value);
    // add xml header
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
        <div class="sidePanelContainer">

        </div>
        <div id="editorContainer"></div>
    </div>

</template>

<style lang="scss" scoped>
#editorContainer{
    width: 100%;
    height:100%;
}
.editorContainer{
    width: 100%;
    height:100%;
    position: relative;
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

</style>
