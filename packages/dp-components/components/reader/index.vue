<template>
<el-dialog v-model="state.dialogVisible" class="reader-dialog" :title="name"
    append-to-body >
    <div class="reader-dialog-main" v-loading="state.loading">
        <template v-if="state.fileType === 'application/pdf' && state.url" >
            <ReaderPdf :name="props.name" :blob="props.blob" :annotations="props.annotations"></ReaderPdf>
        </template>
        <audio v-else-if="state.fileType === 'audio/mpeg'" controls>
            <source :src="state.url" :type="state.fileType" />
        </audio>
        <video v-else-if="state.fileType === 'video/mp4'" controls style="width: 100%">
            <source :src="state.url" :type="state.fileType" />
        </video>
        <el-image v-else-if="state.fileType.includes('image/')"
                :src="state.url" fit="contain"
                :preview-src-list="[state.url]">
            <template #error>
                <div class="image-slot">
                    <el-icon><icon-picture /></el-icon>
                </div>
            </template>
        </el-image>
        <template v-else-if="state.fileType">
            <div class="noSupportContainer">
                {{ $t('msg_thisFormatFileIsNotSupported') }}
            </div>
        </template>
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
    url: '',
    fileType: '',
    dialogVisible: false,
    loading: false
})
function handleOpen() {
    state.dialogVisible = true 
    state.loading = true
    state.fileType = ''
    state.url = ''
}
function handleDownload() {
    downloadBlob(props.blob, props.name, props.blob.type)
}
watch(() => props.blob, (newBlob:Blob) => {
    if( !newBlob ) return
    state.loading = false
    state.fileType = newBlob.type
    const urlCreator = window.URL || window.webkitURL
    state.url = urlCreator.createObjectURL(newBlob)
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
