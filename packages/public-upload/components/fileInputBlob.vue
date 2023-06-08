<template>
<el-upload class="upload-demo" action="" name='files' drag
           :limit="limit" :multiple="multiple" :accept="accept" :disabled="disabled"
           :file-list="state._fileList"
           :on-change="onChange"
           :before-remove="beforeRemove"
           :auto-upload="false">
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">{{$t('common_dragFileHere')}}，{{$t('common_or')}} <em>{{$t('common_clickToUpload')}}</em></div>
    <div class="el-upload__tip" slot="tip"> <slot name="tip"></slot> </div> 
</el-upload>
</template>
<script lang="ts" setup>
const props = defineProps<{
    disabled?: Boolean,
    multiple?: Boolean,
    limit?: Number,
    accept?: String
}>()
const emits = defineEmits(['change'])
const state = reactive({
    fileList: [],
    _fileList: []
})

// 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
const onChange = (file, _fileList) => {
    state.fileList = _fileList
}
const beforeRemove = (file, _fileList) => {
    state.fileList = _fileList
}
const getFilesBlob = () => {
    return [...state.fileList]
}
defineExpose({ getFilesBlob })
</script>
