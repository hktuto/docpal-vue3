<script lang="ts" setup>

import {bpmnToX6} from "../../utils/graphHelper";
const graphEl = ref();

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

function fitIn(padding:number = 100){
  graphEl.value.fitIn(padding);
}

watch(()=> props.bpmn, async(newBpmn) => {
  if (newBpmn) {
    setupGraph();
  }
});

onMounted(() => {
  setupGraph();
})

defineExpose({
  fitIn
})

</script>

<template>
  <div class="workflowEditorViewerContainer">
    <GraphViewer ref="graphEl" :graphJson="graphJson" id="workflowGraphContent" 
                :graph-option="{
                    grid:true,
                    autoResize:true,
                    background: {
                      color: 'var(--color-grey-0000)',
                    },
                    panning: {
                      enabled: true,
                      eventTypes: ['leftMouseDown', 'mouseWheel'],
                    },
                    mousewheel: {
                      enabled: true,
                      modifiers: 'ctrl',
                      factor: 0.2,
                      maxScale: 1.5,
                      minScale: 0.2,
                    },
                    selecting: {
                      enabled: false,
                      multiple: false,
                      rubberband: false,
                      movable: false,
                      showNodeSelectionBox: false,
                    },
                    connecting: {
                      snap: false,
                      allowBlank: false,
                      allowLoop: false,
                      highlight: false,
                      connectionPoint: 'anchor',
                      anchor: 'center',
                    },
                  }" 
    />
  </div>
</template>

<style scoped lang="scss">
.workflowEditorViewerContainer{
  width:100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
#workflowEditorViewerContainer{
  width:100%;
  height:100%;
}
</style>