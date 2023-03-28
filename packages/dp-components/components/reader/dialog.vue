<template>
<el-dialog v-model="state.dialogVisible" class="reader-dialog" :title="name"
    append-to-body >
    <div class="reader-dialog-main" v-loading="state.loading">
        <Reader ref="ReaderRef" v-bind="props" ></Reader>
    </div>

    <template #footer>
        <el-button :icon="Download" @click="handleDownload">{{$t('download')}}</el-button>
    </template>
</el-dialog>
</template>

<script lang="ts" setup>
import { Picture as IconPicture, Download } from '@element-plus/icons-vue'
const props = defineProps<{
    id: string,
    blob: Blob,
    name: string,
    annotations: Array
}>()
const state = reactive({
    dialogVisible: false,
    loading: false
})
function handleOpen() {
    state.dialogVisible = true 
    state.loading = true
}
const ReaderRef = ref()
function handleDownload() {
    ReaderRef.handleDownload()
}
watch(() => props.blob, (newBlob:Blob) => {
    if( !newBlob ) return
    state.loading = false
})
defineExpose({ handleOpen })
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
    &-main{
        height: 70vh;
        width: 100%;
        margin: auto;
        overflow: auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .el-dialog__body{
        display: flex;
    }
}
</style>
