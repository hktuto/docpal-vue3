<script lang="ts" setup>

import {Graph, Node, Options as GraphOptions} from '@antv/x6'
import { register, getTeleport } from '../index';
import { DagreLayout } from '@antv/layout'

const TeleportContainer = getTeleport();

const props = withDefaults(defineProps<{
  id:string,
  graphJson?: string,
  graphOption: any
  layout?: any,
}>(), {
  id: 'graphViewer_' + Date.now().toString(),
  graphOption: {
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
      enabled: true,
      multiple: true,
      rubberband: true,
      movable: true,
      showNodeSelectionBox: true,
    },
    connecting: {
      snap: true,
      allowBlank: false,
      allowLoop: false,
      highlight: true,
      connectionPoint: 'anchor',
      anchor: 'center',
    },
  },
  layout: () => new DagreLayout({
    type: 'dagre',
    rankdir: 'LR',
    ranksep: 40,
    nodesep: 60,
  })
});


const emits = defineEmits<{
  (e: 'node:dblclick', {e: Event, node: Node}): void,
  (e: 'node:click', {e: Event, node: Node}): void,
  (e: 'node:contextmenu', {e: Event, node: Node}): void,
  (e: 'node:mouseenter', {e: Event, node: Node}): void,
  (e: 'node:mouseleave', {e: Event, node: Node}): void,
  (e :'edge:dblclick', {e: Event, edge: Node}): void
}>()

const graph = ref<Graph>();


function getData() {
  return graph.value?.toJSON();
}
function setupGraph() {
  if(!document.getElementById(props.id) || !props.graphJson) {
    return;
  }
  if(graph.value) {
    graph.value?.dispose();
  }
  graph.value = new Graph({
    container: document.getElementById(props.id) as HTMLElement,
    ...props.graphOption,
  });
  const model = props.layout.layout(props.graphJson);
  graph.value.fromJSON(model);
  
  
  graph.value?.on('node:dblclick', ({e, node}) => {
    emits('node:dblclick', {e, node})
  })
  graph.value?.on('node:click', ({e, node}) => {
    emits('node:click', {e, node})
  })
  graph.value?.on('node:contextmenu', ({e, node}) => {
    emits('node:contextmenu', {e, node})
  })
  graph.value?.on('node:mouseenter', ({e, node}) => {
    emits('node:mouseenter', {e, node})
  })
  graph.value?.on('node:mouseleave', ({e, node}) => {
    emits('node:mouseleave', {e, node})
  })
  graph.value?.on('edge:dblclick', ({e, edge}) => {
    emits('edge:dblclick', {e, edge})
  })
  graph.value.on('view:mounted', ({ view }) => {
    graph.value.zoomToFit({padding: 100});
    graph.value.centerContent()
  })
}

onMounted(() => {
  setupGraph();
})
watch(() => props.graphJson, (newVal, oldVal) => {
  if (newVal !== oldVal && newVal) {
    setupGraph();
  }
})

defineExpose({
  getData,
  setupGraph,
  graph
})

</script>

<template>
  <div class="viewerContainer">
    <div :id="id" class="graph"></div>
    <TeleportContainer />
  </div>
</template>

<style scoped lang="scss">
.viewerContainer{
  width:100%;
  height: 100%;
  min-height: 200px;
  position: relative;
  overflow: hidden;
  > .graph{
    width:100%;
    height: 100%;
  }
}
</style>