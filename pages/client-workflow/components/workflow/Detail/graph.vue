<template>
<div class="bpmnContainer">
    <WorkflowEditorViewer v-if="bpmnFile" ref="WorkflowEditorRef" :bpmn="bpmnFile">
    </WorkflowEditorViewer>
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

const bpmnFile = ref()
const WorkflowEditorRef = ref();


const handleShown = () => {
    const steps = props.steps && props.steps.length > 0 ? props.steps : props.step ? [props.step] : []
    if (modeler.value && steps) {
    const canvas = modeler.value.get('canvas')
    for(const step of steps) {
        canvas.addMarker(step, 'bpmn-highlight')
    }

    }
}

const getBpmn = async (processDefinitionId: string, processKey: string) => {;
    if (!processDefinitionId && !processKey) return
    const data = processKey
    ? {
        processKey,
        }
    : { processDefinitionId }
    const blob = await getBpmnApi(data)
    const text = await blob.text()
    bpmnFile.value = text
    setTimeout(()=>{
      WorkflowEditorRef.value.fitIn(10);
    }, 1000)
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
  min-height:400px;
    overflow: auto;
}
#modeler-container{
    height: 100%;
    width: 100%;
}

</style>

