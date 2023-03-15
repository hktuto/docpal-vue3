<template>
<div class="bpmnContainer">
    <client-only>
        {{state.bpmn}}
        {{state.options}}
        <!-- <vue-bpmn ref="vBpmn" :url="state.bpmn" :options="state.options" @shown="handleShown" /> -->
    </client-only>
</div>
</template>
<script lang="ts" setup>
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
const vBpmn = ref()
const handleShown = () => {
    const steps = props.steps.length > 0 ? props.steps : props.step ? [props.step] : []
    if (vBpmn.value.bpmnViewer && steps) {
        const canvas = vBpmn.value.bpmnViewer.get('canvas')
        for(const step of steps) {
            canvas.addMarker(step, 'bpmn-highlight')
        }
    }
}
const getBpmn = async (processDefinitionId: string, processKey: string) => {
    if (!processDefinitionId && !processKey) return
    const data = processKey
    ? {
        processKey,
        }
    : { processDefinitionId }
    const bpmn = await getBpmnApi(data)
    console.log(bpmn);
    const urlCreator = window.URL || window.webkitURL
    const url = urlCreator.createObjectURL(bpmn)
    console.log({url});
    
    return url
}
watch(props,() => {
    console.log(props.steps, 'ssssssssssssssssssssssssssssssssssss')
},{
    immediate:true
})
watch(()=> [props.processKey, props.processDefinitionId], async([newKey, newId]) => {
    if (newKey || newId) {
        state.bpmn = await getBpmn(newId, newKey)
    }
}, { immediate: true })
</script>
<style lang="scss" scoped>
.bpmnContainer {
    height: 100%;
    overflow: auto;
}
</style>
