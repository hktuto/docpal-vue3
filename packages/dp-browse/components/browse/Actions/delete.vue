<template>
    <!-- <SvgIcon src="/icons/file/delete.svg" round content="delete"
                @click="deleteItem(doc)"></SvgIcon> -->
    <BrowseActionsButton id="deleteActionButton" :label="$t('delete')" @click="deleteItem(doc, true)">
        <el-tooltip content="delete">
            <div class="actionIconContainer" >

            <el-icon >
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V256zm448-64v-64H416v64h192zM224 896h576V256H224v640zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32zm192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32z"></path></svg>
            </el-icon>
            </div>
        </el-tooltip>
    </BrowseActionsButton>
</template>

<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { Loading } from '@element-plus/icons-vue';
import { ElNotification, ElMessageBox } from 'element-plus'
import { trashApi, CheckShareInternalApi } from 'dp-api'
const props = defineProps<{
    doc: any
}>()
const emits = defineEmits(['delete'])
async function deleteItem(doc:any, isDetail: boolean = false){
    const idOrPath = doc.path
    let msg = ''
    const isShareInternal = await CheckShareInternalApi({
        documentId: doc.id
    })
    if (isShareInternal) msg += `<span class="color__danger">${doc.name} ${$t('msg_isShareInternalFile')}</span>,`
    msg += $t('msg_confirmWhetherToDelete')
    ElMessageBox.confirm(msg, {
        dangerouslyUseHTMLString: true,
    })
    .then(async() => {
        const noti = ElNotification({
            title: $t('delete'),
            icon: Loading,
            dangerouslyUseHTMLString: true,
            message: `<div title="${doc.name}">${doc.name}</div>`,
            showClose: true,
            customClass: 'loading-notification',
            duration: 0,
            position: 'bottom-right'
        });
        const response = await trashApi([{idOrPath}])
        if(isDetail) {
          emits('delete', idOrPath)
        }else{
          emits('success', doc)
        }
        
        noti.close()
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