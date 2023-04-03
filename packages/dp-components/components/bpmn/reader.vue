<template>
    <div class="containers">
    <div class="canvas" ref="canvasRef"></div> <!--属性面板将通过该元素呈现到其中-->
  </div>

</template>

<script lang="ts" setup>
import BpmnModeler from 'bpmn-js/lib/Modeler.js'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

const props = defineProps<{
    file?:Blob
}>();

function generateGraph() {}

</script>