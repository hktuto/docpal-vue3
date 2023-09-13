<template>
  <BrowseActionsButton id="deleteSelectActionButton" :label="$t('tip.deleteSelected')" @click="deleteSelected()">
    <SvgIcon src="/icons/file/delete.svg" round :content="$t('tip.deleteSelected')"
        ></SvgIcon>
  </BrowseActionsButton>
</template>

<script lang="ts" setup>
import { Loading } from '@element-plus/icons-vue';
import { ElNotification, ElMessageBox } from 'element-plus'
import { trashApi, CheckShareInternalApi } from 'dp-api'
const props = defineProps<{
    selected: any
}>()
const emits = defineEmits(['success'])
async function deleteSelected () {
    let msg = await checkAllShareInternal()
    msg += $t('msg_confirmWhetherToDelete')
    ElMessageBox.confirm(msg, {
        dangerouslyUseHTMLString: true,
    })
    .then(async() => {
        const noti = ElNotification({
            title: $t('delete'),
            icon: Loading,
            dangerouslyUseHTMLString: true,
            showClose: true,
            customClass: 'loading-notification',
            duration: 0,
            position: 'bottom-right'
        });
        const params = props.selected.map(item => ({ idOrPath: item.id }))
        const response = await trashApi(params)
        emits('success')
        noti.close()
        ElNotification({
            title: 'Success',
            message: 'Items deleted',
            type: 'success',
            duration: 2000
        });
    })
}
async function checkAllShareInternal () {
    let msg = ''
    let pList = []
    props.selected.forEach((element) => {
        pList.push(checkShareInternal(element))
    });
    await Promise.all(pList)
    return msg ? `<span class="color__danger">${msg} ${$t('msg_isShareInternalFiles')}, </span>` : ''
    async function checkShareInternal (row) {
        const isShareInternal = await CheckShareInternalApi({
            documentId: row.id
        })
        if (msg) msg += ','
        if (isShareInternal) msg += row.name
    }
}
onMounted(() => {
})
</script>