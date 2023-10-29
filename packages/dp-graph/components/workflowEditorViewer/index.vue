<script lang="ts" setup>

import {bpmnToX6} from "../../utils/graphHelper";


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

watch(()=> props.bpmn, async(newBpmn) => {
  if (newBpmn) {
    setupGraph();
  }
});

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