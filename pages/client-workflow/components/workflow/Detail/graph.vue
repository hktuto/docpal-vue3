<template>
<div class="bpmnContainer">
    <div ref="bpmnEl" id="modeler-container" ></div>
</div>
</template>
<script lang="ts" setup>

import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js'

import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
// import VueBpmn from 'vue-bpmn'
import { getBpmnApi } from 'dp-api'
const props = defineProps<{
    processDefinitionId?: string,
    processKey?: string,
    steps: Array,
    step: string
}>()
const state = reactive({
    bpmn: '',
    options: {
        bpmnRenderer: {
            defaultFillColor: 'var(--color-grey-000)',
            defaultStrokeColor: 'var(--color-grey-900)',
        }
    }
})
const bpmnEl = ref()
const viewer = ref<typeof BpmnViewer>(null);
const modeler = ref<typeof BpmnModeler>(null);

function init () {
  const options = {
    container: bpmnEl.value,
    height: "100%",
    width: "100%",
    bpmnRenderer: {
        defaultFillColor: 'var(--color-grey-000)',
        defaultStrokeColor: 'var(--color-grey-900)',
    }
  }
  modeler.value = new BpmnJS(options);
  modeler.value.on('import.done', (event) => {
        var error = event.error;
        var warnings = event.warnings;
        
        modeler.value.get('canvas').zoom('fit-viewport');
        handleShown()
  })
}

const handleShown = () => {
    dpLog("handleShown")
    const steps = props.steps && props.steps.length > 0 ? props.steps : props.step ? [props.step] : []
    if (modeler.value && steps) {
    const canvas = modeler.value.get('canvas')
    for(const step of steps) {
        dpLog('step', step)
        canvas.addMarker(step, 'bpmn-highlight')
    }
    
    }
}

const getBpmn = async (processDefinitionId: string, processKey: string) => {
    dpLog('getBpmn', processDefinitionId, processKey);
    if (!processDefinitionId && !processKey) return
    const data = processKey
    ? {
        processKey,
        }
    : { processDefinitionId }
    const blob = await getBpmnApi(data)
    const text = await blob.text()

    if(!modeler.value ) init();
    modeler.value.importXML(text)
}

watch(()=> [props.processKey, props.processDefinitionId], async([newKey, newId]) => {
    if (newKey || newId) {
        await getBpmn(newId, newKey)
    }
}, { immediate: true })
</script>
<style lang="scss" scoped>
.bpmnContainer {
    height: 100%;
    overflow: auto;
}
#modeler-container{
    height: 100%;
    width: 100%;
}
</style>

<style >
.bpmn-highlight:not(.djs-connection) .djs-visual > :nth-child(1) {
  fill: rgb(49, 170, 49) !important; /* color elements as green */
}
</style>
