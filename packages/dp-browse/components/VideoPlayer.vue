<template>
    <div v-loading="loading" class="videoPlayerContainer" >
        <video :src="videoSrc" controls />
    </div>
</template>

<script lang="ts" setup>
import { GetDocumentPreview } from 'dp-api'
const props = defineProps<{
    doc:any
}>()
const {doc} = toRefs(props);
const videoSrc = ref();
const loading = ref(false);
async function getData() {
    loading.value = true;
    try {
        const blob = await GetDocumentPreview(props.doc.id);
        const url = window.URL.createObjectURL(blob);
        videoSrc.value = url;
    } catch (error) {
        
    }
    loading.value = false;
}
function refresh() {
    getData()
}
defineExpose({ refresh })
watch(doc, () => {
    getData();
},{
    immediate: true
})


</script>

<style lang="scss" scoped>
.videoPlayerContainer {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    margin: 0 auto;
    overflow: hidden;
    background: var(--color-grey-0000);
    border-radius: 12px;
}
video {
    width: 100%;
}
</style>