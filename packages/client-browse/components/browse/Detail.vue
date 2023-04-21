<template>
    <div class="browseDetailContainer">
        <div v-show="show" class="dialog">
            <div id="modalHeader">
                <slot />
            </div>
            <div class="content">
                <div class="preview">
                    <LazyPdfViewer v-if="readerType === 'pdf'" :doc="doc"  />
                    <LazyVideoPlayer v-if="readerType === 'video'" :doc="doc" />
                </div>
                <div class="info">
                    <slot name="info" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onKeyStroke } from '@vueuse/core'

const props = defineProps<{
    doc: any
    show: boolean,
}>();
const {show} = toRefs(props);
const emit = defineEmits(['close'])
const blobData = ref();

const readerType = computed(() => {
    const properties = props.doc?.properties
    const mineType:string = properties["file:content"] && properties["file:content"]["mime-type"] ? properties["file:content"]["mime-type"] : '';
    if(!mineType) return "pdf"; // set to pdf for testing
    if(mineType.includes('image') || mineType.includes('pdf') || mineType.includes('document') || mineType.includes('text')  ) {
        return 'pdf';
    }
    if(mineType.includes('video')) {
        return 'video';
    }
    return 'pdf';
});

onKeyStroke("Escape", (e) => {
    console.log("Escape", e);
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
    height: 100%;
    z-index: 5;
    background-color: rgba(0,0,0,0.8);
    display: grid;
    grid-template-rows: min-content 1fr;
}
#modalHeader{
    display: grid;
    grid-template-columns: 1fr min-content;
    gap: var(--app-padding);
    padding-inline: var(--el-component-size-small);
    padding-top: var(--app-padding);
    color: var(--color-grey-0000);
    align-content: center;
}
.header{
    min-height: 40px;;
}
.content{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr min-content;
    padding: var(--el-component-size-small);
    .info {
        transition: width .2s ease-in-out;
    }
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
    font-size: var(--el-font-size-large);
    text-align: center;
    color: var(--color-grey-0000);
}
</style>
