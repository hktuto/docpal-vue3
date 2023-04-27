<template>
    <!-- <SvgIcon src="/icons/file/delete.svg" round content="delete"
                @click="deleteItem(doc)"></SvgIcon> -->
        <el-tooltip content="delete">
            <div class="actionIconContainer" @click="deleteItem(doc)">

            <el-icon >
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V256zm448-64v-64H416v64h192zM224 896h576V256H224v640zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32zm192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32z"></path></svg>
            </el-icon>
            </div>
        </el-tooltip>
</template>

<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { ElNotification, ElMessageBox } from 'element-plus'
import { trashApi } from 'dp-api'
const props = defineProps<{
    doc: any
}>()
const emits = defineEmits(['delete'])

function deleteItem(doc){
    const idOrPath = doc.path
    
    ElMessageBox.confirm(`${$i18n.t('msg_confirmWhetherToDelete')}`)
    .then(async() => {
        const response = await trashApi([{idOrPath}])
        emits('success', idOrPath)
        emits('delete', idOrPath)
        
        if (props.doc?.isFolder) {}
        ElNotification({
            title: 'Success',
            message: 'Item deleted',
            type: 'success',
            duration: 2000
        });
    })
}
onMounted(() => {
    useEventListener(document, 'docActionDelete', (event) => deleteItem(event.detail))  
})
</script>