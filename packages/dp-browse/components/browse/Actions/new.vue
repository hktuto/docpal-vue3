<template>
<el-dropdown @command="handleCommand">
    <SvgIcon src="/icons/file/newFolder.svg" round></SvgIcon>
    <template #dropdown>
        <el-dropdown-menu>
            <el-dropdown-item command="docActionAddFolder" >
                <SvgIcon class="el-icon--left" src="/icons/file/folder-add.svg"></SvgIcon>
                {{$t('filePopover_newFolder')}}</el-dropdown-item>
            <el-dropdown-item command="docActionUploadFile" divided>
                <SvgIcon class="el-icon--left" src="/icons/file/file-upload.svg"></SvgIcon>
                {{$t('filePopover_uploadFile')}}</el-dropdown-item>
            <el-dropdown-item command="docActionUploadFolder">
                <SvgIcon class="el-icon--left" src="/icons/file/folder-upload.svg"></SvgIcon>
                {{$t('filePopover_uploadFolder')}}</el-dropdown-item>
        </el-dropdown-menu>
    </template>
</el-dropdown>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import {  } from 'dp-api'
const props = defineProps<{
    doc: any
}>()
const emits = defineEmits([]);
const state = reactive({
})
function handleCommand(command) {
    const data = props.doc
    const ev = new CustomEvent(command,{ detail: data })
    document.dispatchEvent(ev)
}
</script>
<style lang="scss" scoped>
.mg-r {
    margin-right: var(--app-padding);
}
</style>
