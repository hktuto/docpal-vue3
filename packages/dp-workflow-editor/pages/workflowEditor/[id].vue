<template>
<NuxtLayout class="fit-height withPadding" backPath="/workflowEditor" :pageTitle="$t('workflowEditor.custom')">
    <div class="pageContainer">
        <WorkflowEditor v-if="bpmnFile" :bpmn="bpmnFile"/>
    </div>
</NuxtLayout>
</template>

<script lang="ts" setup>
const demoFile = "/bpmn/single.xml";
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

<style >
#__nuxt{
    width:100vw;
    height: 100vh;
}
body{
    width:100vw;
    height: 100vh;
    overflow: hidden;
}
.pageContainer{
    width:100%;
    height: 100%;
    overflow: hidden;
}
</style>