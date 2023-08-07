<template>

    <template v-if="!state.url" >
        <div v-if="id">{{$t('fileNoExist')}}</div>
    </template>
    <template v-else-if="state.fileType === 'application/pdf' && state.url" >
        <ReaderPdf v-bind="props" :no-annotation="!!annotations" ></ReaderPdf>
    </template>
    <template v-else-if="state.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'">
        <ReaderDocx v-bind="props"></ReaderDocx>
    </template>
    <template v-else-if="state.fileType === 'image/tiff' && state.url" >
        <ReaderTiff v-bind="props" ></ReaderTiff>
    </template>
    <audio v-else-if="state.fileType === 'audio/mpeg'" controls>
        <source :src="state.url" :type="state.fileType" />
    </audio>
    <video v-else-if="state.fileType === 'video/mp4'" controls style="width: 100%">
        <source :src="state.url" :type="state.fileType" />
    </video>
    <ReaderImgMouse v-else-if="state.fileType.includes('image/')">
        <el-image
                :src="state.url" fit="contain">
            <template #error>
                <div class="image-slot">
                    <el-icon><icon-picture /></el-icon>
                </div>
            </template>
        </el-image>
    </ReaderImgMouse>
    <template v-else-if="state.fileType">
        <h2 class="noSupportContainer">
            {{ $t('msg_thisFormatFileIsNotSupported') }}
        </h2>
    </template>
</template>

<script lang="ts" setup>
type PdfJsOptions = {
    print: boolean,
    loadAnnotations: boolean,
}
const props = withDefaults(defineProps<{
    id: string,
    blob: Blob,
    name: string,
    annotations?: Map<string, any>,
    loading: Boolean,
    options: PdfJsOptions
}>(), {
    options:{
        print: false,
        loadAnnotations: false,
    }
})
const state = reactive({
    url: '',
    fileType: '',
})
function handleDownload() {
    downloadBlob(props.blob, props.name, props.blob.type)
}
watch(() => props.blob, (newBlob:Blob) => {
    if( !newBlob ) return
    state.fileType = newBlob.type
    
    const urlCreator = window.URL || window.webkitURL
    state.url = urlCreator.createObjectURL(newBlob)
}, { immediate: true })
defineExpose({ handleDownload })
</script>
