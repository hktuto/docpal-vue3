<template>
<div style="height: 100%" v-loading="state.loading">
    <div v-if="state.type.includes('audio')" class="videoPlayerContainer" >
        <audio  controls>
            <source :src="state.src" :type="state.type" />
        </audio>
    </div>
    <ReaderTiff v-else-if="state.type.includes('image/tiff')" v-bind="state" ></ReaderTiff>
</div>
</template>

<script lang="ts" setup>
import { GetDocumentPreview } from 'dp-api'
const props = defineProps<{
    doc:any
}>()
const state = reactive({
    type: '',
    src: '',
    blob: null,
    loading: false
})
const {doc} = toRefs(props);
async function getData() {
    state.loading = true;
    try {
        const blob = await GetDocumentPreview(props.doc.id);
        const url = window.URL.createObjectURL(blob);
        state.type = blob.type;
        state.blob = blob
        state.src = url;
    } catch (error) {
        
    }
    state.loading = false;
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