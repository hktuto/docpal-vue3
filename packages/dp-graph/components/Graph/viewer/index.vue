<script lang="ts" setup>

import {Graph, Node, Options as GraphOptions} from '@antv/x6'
import { register, getTeleport } from '../index';
import { DagreLayout } from '@antv/layout'

const TeleportContainer = getTeleport();

const props = withDefaults(defineProps<{
  id:string,
  graphJson?: string,
  graphOption: any
  layout: any,
}>(), {
  id: 'graphViewer_' + Date.now().toString(),
  graphOption: {
    grid:true,
    autoResize:true,
    background: {
      color: '#F2F7FA',
    },
    panning: {
      enabled: true,
      eventTypes: ['leftMouseDown', 'mouseWheel'],
    },
    mousewheel: {
      enabled: true,
      modifiers: 'ctrl',
      factor: 0.5,
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
  (e: 'node:dblclick', {ev: Event, node: Node}): void,
  (e: 'node:click', {ev: Event, node: Node}): void,
  (e: 'node:contextmenu', {ev: Event, node: Node}): void,
  (e: 'node:mouseenter', {ev: Event, node: Node}): void,
  (e: 'node:mouseleave', {ev: Event, node: Node}): void,
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
  console.log(props.graphJson)
  const model = props.layout.layout(props.graphJson);
  graph.value.fromJSON(model);
  graph.value.centerContent()
  
  graph.value?.on('node:dblclick', ({ev, node}) => {
    emits('node:dblclick', {ev, node})
  })
  graph.value?.on('node:click', ({ev, node}) => {
    emits('node:click', {ev, node})
  })
  graph.value?.on('node:contextmenu', ({ev, node}) => {
    emits('node:contextmenu', {ev, node})
  })
  graph.value?.on('node:mouseenter', ({ev, node}) => {
    emits('node:mouseenter', {ev, node})
  })
  graph.value?.on('node:mouseleave', ({ev, node}) => {
    emits('node:mouseleave', {ev, node})
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
  position: relative;
  overflow: hidden;
  > .graph{
    width:100%;
    height: 100%;
  }
}
</style>