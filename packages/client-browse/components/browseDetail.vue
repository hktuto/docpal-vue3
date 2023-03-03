<template>
    <div class="browseDetailContainer">
        <div v-if="show" class="dialog">
            <div class="header">
                <div class="headerLeft"></div>
                <div class="fileName">{{ doc.name }}</div>
                <div class="headerRight"></div>
            </div>
            <div class="content">
                <LazyPdfViewer v-if="readerType === 'pdf'" :doc="doc"  />
                <LazyVideoPlayer v-if="readerType === 'video'" :doc="doc" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { vOnKeyStroke } from '@vueuse/components'
import { onKeyStroke } from '@vueuse/core'

const props = defineProps<{
    doc: Object
    show: boolean,
}>();
const {show} = toRefs(props);
const emit = defineEmits(['close'])
const blobData = ref();

const readerType = computed(() => {
    const properties = props.doc?.properties
    const mineType:string = properties["file:content"] && properties["file:content"]["mime-type"] ? properties["file:content"]["mime-type"] : '';
    if(!mineType) return "unknown";
    if(mineType.includes('image') || mineType.includes('pdf') || mineType.includes('document') || mineType.includes('text')  ) {
        return 'pdf';
    }
    if(mineType.includes('video')) {
        return 'video';
    }
    return 'unknown';
});

onKeyStroke("Escape", (e) => {
    if(props.show) {
        emit('close')
    }
})


</script>

<style lang="scss" scoped>
.dialog{
    position: fixed;
    left:0;
    top:0;
    width: 100vw;
    height: 100vh;
    z-index: 5;
    background-color: rgba(0,0,0,0.8);
    display: grid;
    grid-template-rows: min-content 1fr;
}
.header{
    min-height: 40px;;
}
.content{
    width: 100%;
    height: 100%;
    display: flex;
    place-items: center;
    padding: var(--el-component-size-small);
    
}
.header{
    width: 100%;
    padding: var(--app-padding);
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    gap: var(--app-padding);
    border-bottom: 1px soild var(--el-text-color-regular);
}
.fileName{
    font-size: var(--el-font-size-extra-large);
    text-align: center;
}
</style>