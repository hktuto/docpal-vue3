<template>
<div class="workflowReader" v-loading="previewFile.loading">
    <Reader ref="ReaderRef" v-bind="previewFile" ></Reader>
</div>
</template>
<script lang="ts" setup>
import { WorkflowAttachmentPreviewApi } from "dp-api";
const props = defineProps<{
    id: any
}>();
const previewFile = reactive({
    blob: null,
    name: '',
    id: '',
    loading: false,
    downloadLoading: false,
    options: {
        readOnly: true
    }
})
async function init (fileId: string) {
    previewFile.loading = true
    try {
        previewFile.blob = await WorkflowAttachmentPreviewApi(fileId)
    } catch (error) {

    }
    previewFile.loading = false
    previewFile.id = fileId
}
defineExpose({ init })
</script>
<style lang="scss" scoped>
.workflowReader {
    height: 100%;
}
</style>
