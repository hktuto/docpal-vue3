<template>
    <div v-loading="state.loading" class="videoPlayerContainer" >
        <audio v-if="state.type.includes('audio')" controls>
            <source :src="state.src" :type="state.type" />
        </audio>
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
    loading: false
})
const {doc} = toRefs(props);
async function getData() {
    state.loading = true;
    try {
        const blob = await GetDocumentPreview(props.doc.id);
        const url = window.URL.createObjectURL(blob);
        state.type = blob.type;
        state.src = url;
    } catch (error) {
        
    }
    state.loading = false;
}

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