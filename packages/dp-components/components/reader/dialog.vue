<template>
<el-dialog v-model="state.dialogVisible" class="reader-dialog" :title="name"
    append-to-body >
    <div class="reader-dialog-main" v-loading="loading">
        <Reader ref="ReaderRef" v-bind="props" ></Reader>
    </div>

    <template #footer>
        <el-button v-if="!loading && blob && !_options.noDownload"  :icon="Download" @click="handleDownload">{{$t('download')}}</el-button>
        <slot name="actions"></slot>
    </template>
</el-dialog>
</template>

<script lang="ts" setup>
import { Picture as IconPicture, Download } from '@element-plus/icons-vue'
import { deepCopy } from 'dp-api'
const emits = defineEmits(['download'])
export type readerOptions = {
    noDownload?: Boolean,
    print: false,
    loadAnnotations: false,
} 
const props = withDefaults(defineProps<{
    id: string,
    blob: Blob,
    name: string,
    annotations?: Array,
    loading: Boolean,
    options: readerOptions
}>(), {
    options:{
        print: false,
        loadAnnotations: false,
    }
})
const _options = computed<readerOptions>(() => {
    const option = {
        noDownload: false
    }
    return Object.assign(option, props?.options)
})
const state = reactive({
    dialogVisible: false
})
function handleOpen() {
    state.dialogVisible = true 
}
function handleClose() {
    state.dialogVisible = false 
}
const ReaderRef = ref()
function handleDownload() {
    ReaderRef.value.handleDownload()
}
onMounted(() => {
    
    
})
defineExpose({ handleOpen, handleClose })
</script>

<style scoped lang="scss">
</style>
<style lang="scss">
.reader-dialog {
    margin: unset;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-height: 80vh;
    max-height: 90vh;
    width: 80vw;
    display: grid;
    grid-template-rows: min-content 1fr min-content;
    &-main{
        max-height: 70vh;
        width: 100%;
        height: 100%;
        margin: auto;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .el-dialog__body{
        display: flex;
        padding: var(--app-padding) var(--el-dialog-padding-primary);
    }
}
</style>
