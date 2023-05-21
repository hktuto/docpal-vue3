<template>
    <div class="videoPlayerContainer" v-loading="loading">
        <video :src="videoSrc" />
    </div>
</template>

<script lang="ts" setup>
import { GetDocumentPreview } from 'dp-api'
const props = defineProps<{
    doc:object
}>()
const videoSrc = ref();
const loading = ref(false);
async function getData() {
    loading.value = true;
    const blob = await GetDocumentPreview(props.doc.id);
    const url = window.URL.createObjectURL(blob);
    videoSrc.value = url;
    loading.value = false;
}


</script>

<style lang="scss" scoped>
.videoPlayerContainer {
    width: 100%;
    max-width: 800px;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
}
video {
    width: 100%;
}
</style>