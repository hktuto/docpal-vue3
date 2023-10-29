<script lang="ts" setup>
import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser';
import { Graph, Node } from '@antv/x6'
import { register } from '../Graph'
import DefaultNode from '../Graph/node/index.vue'
import {bpmnToX6} from "../../utils/graphHelper";
register({
  shape: 'custom-vue-node',
  width: 100,
  height: 100,
  component: DefaultNode,
})

const props = defineProps({
  bpmn: {
    type: String,
    default: ""
  }
});

const graphJson = ref();
function setupGraph() {
  graphJson.value = bpmnToX6(props.bpmn, {hideEnd:false});
}

onMounted(() => {
  setupGraph();
})
</script>

<template>
  <div class="workflowEditorViewerContainer">
    <GraphViewer :graphJson="graphJson" id="workflowGraphContent" />
  </div>
</template>

<style scoped lang="scss">
.workflowEditorViewerContainer{
  width:100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>