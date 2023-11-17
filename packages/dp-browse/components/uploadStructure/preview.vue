<template>
<InteractDrawer ref="InteractDrawerRef">
    <h3>{{state.doc.name}}</h3>
    <Reader v-bind="previewFile"></Reader>
</InteractDrawer>
</template>


<script lang="ts" setup>
const supportList:string[] = [];
const isSupport = ref(false)
const previewType = ref<"image" | "pdf" | "video" | "text">('image')
const state = reactive({
    url: "",
    doc: {}
})
const previewFile = reactive({
    blob: null,
    name: '',
    id: '',
    path: '',
    loading: false,
    options: {
        noDownload: true,
        print: false,
        loadAnnotations: false,
        readOnly: true
    }
})
const InteractDrawerRef = ref()
async function init(doc) {
    state.doc = doc
    if(doc.file) {
        previewFile.blob = await fileToBlob(doc.file)
        InteractDrawerRef.value.handleOpen()
    }
    else InteractDrawerRef.value.handleSwitch()
}
function fileToBlob (file) {
    return new Promise(resolve => {
        let reader = new FileReader()
        reader.readAsArrayBuffer(file)
        let blob = null;
        reader.onload = (e) => {
        if (typeof e.target.result === 'object') {
            blob = new Blob([e.target.result], { type: file.type })
        } else {
            blob = e.target.result
        }
            resolve(blob)
        }
    })
}
defineExpose({
    init
})  
</script>


<style lang="scss" scoped>
.interactContainer {
    height: 100%;
    display: grid;
    grid-template-rows: min-content 1fr;
}
.previewContainer{
    overflow: hidden;
    background: var(--color-grey-050);
    padding: var(--app-padding);
}
.imgContainer{
    width: 100%;
    height: 100%;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}
.noSupportContainer{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
