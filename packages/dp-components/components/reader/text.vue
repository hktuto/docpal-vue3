<template>
<div class="docxContainer" :loading="props.loading">
    <div v-for="item in state.lines">{{item}}</div>
</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    annotations: Map<string,any>,
    blob: Blob,
    name: String,
    options: PdfJsOptions,
    loading: Boolean
}>();
const state = reactive({
    lines: [],
})
const refWord = ref()
function blobToFile(blob, fileName) {
	return new File([blob], fileName, {type: blob.type});
}

function fileRead (file) {
    return new Promise(resolve => {
        let reader = new FileReader()
        reader.readAsText(file)
        reader.onload = (e) => {
            const contents = e.target.result;
            state.lines = contents.split('\n');
        };
    })
}

watch(() => props.blob, async(newBlob) => {
    const fileObj = blobToFile(newBlob, 'text.txt')
    fileRead(fileObj)
}, {
    immediate: true
})
</script>

<style lang="scss" scoped>
.docxContainer{
    height: 100%;
    overflow: auto;
}
</style>
