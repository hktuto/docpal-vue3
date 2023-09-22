<template>
    <NuxtLayout>
        <WorkflowEditor v-if="bpmnFile" :bpmn="bpmnFile"/>
    </NuxtLayout>
</template>

<script lang="ts" setup>

const demoFile = "/bpmn/Multiple_Approval.xml";
const bpmnFile = ref();

async function getDemoFile() {
    const response = await fetch(demoFile);
    const text = await response.text();
    bpmnFile.value = text;
}

onMounted(async() => {
    await getDemoFile();
})

</script>