<template>
    <div>
        <el-upload
            action=""
            name='files'
            class="upload-demo"
            drag
            :file-list="modelValue"
            :limit="limit" :multiple="multiple" :disabled="disabled"

            :on-change="onChange"
            :before-remove="beforeRemove"
            :on-remove="onRemove"
            :auto-upload="false"
            :accept="accept"
            :on-exceed="handleExceed"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">{{$t('common_dragFileHere')}}，{{$t('common_or')}} <em>{{$t('common_clickToUpload')}}</em></div>
            <div v-if="accept" class="el-upload__accept">{{$t('file.onlyAccept')}} {{accept}}</div>
            <div class="el-upload__tip" slot="tip"> <slot name="tip"></slot> </div> 
        </el-upload>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    disabled: Boolean,
    multiple: Boolean,
    limit: Number,
    modelValue: Array,
    defaultMeta: Object,
    accept: String
}>();
const emit = defineEmits(['update:modelValue', 'change'])

const fileDetail = ref()

const onChange = async(file, fileList) => {
    const subFileList = []
    fileList.forEach(item => {
    const newFile = {
        ...item,
        name: item.name,
        blob: item.raw
    }
    if (props.defaultMeta) {
        Object.keys(props.defaultMeta).forEach(key => {
        newFile[key] = props.defaultMeta[key]
        })
    }
    subFileList.push(newFile)
    });
    emit('update:modelValue', [...subFileList])
    emit('change', [...subFileList])
}

/** 
 * file: 正在删除的文件,
*/
const beforeRemove = (file, fileList) => {
    const subFileList = [...props.modelValue]
    // @ts-ignore
    const index = subFileList.findIndex(item => item.uid === file.uid)
    subFileList.splice(index, 1)
    emit('update:modelValue', [...subFileList])
    emit('change', [...subFileList])
}
/** 
 * file: 正在删除的文件,
 * fileList: 剩余文件,
*/
const onRemove = (file, fileList) => {
}
function handleExceed(files){
    if(props.limit === 1) {
        emit('update:modelValue', [...files])
        emit('change', [...files])
    }
}
</script>

<style lang="scss" scoped>
:deep .el-upload-dragger {
    width: 100%;
}
.el-upload__accept {
    font-size: 12px;
    font-weight: bold;
    line-height: 22px;
    letter-spacing: 0px;
        
    font-feature-settings: "kern" on;
    color: #9E9E9E;
}
</style>