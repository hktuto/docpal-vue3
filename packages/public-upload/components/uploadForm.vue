<template>
<el-card class="formContainer">
    <div class="flex-x-start">
        <Logo class="logo" mode="withName" />
    </div>
    <div>Message</div>
    <div v-html="fileRequestDetail.config.message"></div>
    <FileInputBlob ref="FileInputBlobRef" v-bind="fileOptions"></FileInputBlob>
    <div class="footer">
        <el-button @click="handleSubmit">{{$t('submit')}}</el-button>
    </div>
</el-card>
</template>
<script lang="ts" setup>
const props = defineProps<{
    fileRequestDetail?: Object,
}>()
const emits = defineEmits(['submit'])
const fileOptions = computed(() => ({
    limit: props.fileRequestDetail.config.maximum || '',
    accept: props.fileRequestDetail.config.fileType || '',
    multiple: true,
}))
const FileInputBlobRef = ref()
function getFilesBlob() {
    return FileInputBlobRef.value.getFilesBlob()
}
function handleSubmit () {
    const data = getFilesBlob()
    emits('submit', data)
}
</script>

<style lang="scss" scoped>
.el-card {
    // position: fixed;
    min-width: 300px;
    max-width: 600px;
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;

    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .logo{
        width: 80%;
        max-width: 200px;
        margin: 0 auto var(--el-component-size-small) auto;
    }
}

.footer {
    text-align: right;
}
:deep(.el-upload-list) {
    max-height: 30vh;
    overflow: auto;
}
</style>