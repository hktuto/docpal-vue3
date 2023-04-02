<template>
    <div class="actionIconContainer">
        <el-tooltip content="delete">
            <el-icon @click="deleteItem">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V256zm448-64v-64H416v64h192zM224 896h576V256H224v640zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32zm192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32z"></path></svg>
            </el-icon>
        </el-tooltip>
    </div>
</template>

<script lang="ts" setup>
import { ElNotification } from 'element-plus'
const props = defineProps<{
    doc: any
}>()
const emits = defineEmits<{
    (event: 'delete', ...args: any[]): void
}>()

function deleteItem(){
    // TODO : delete item and emit event to parent
    emits('delete', props.doc)
    // delete item
    ElNotification({
        title: 'Success',
        message: 'Item deleted',
        type: 'success',
        duration: 2000
    });
}
</script>