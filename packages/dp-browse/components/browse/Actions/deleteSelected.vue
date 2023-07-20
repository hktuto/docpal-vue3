<template>
  <BrowseActionsButton id="deleteSelectActionButton" :label="$t('delete')" @click="deleteSelected()">
    <SvgIcon src="/icons/file/delete.svg" round content="delete"
        ></SvgIcon>
  </BrowseActionsButton>
</template>

<script lang="ts" setup>
import { Loading } from '@element-plus/icons-vue';
import { ElNotification, ElMessageBox } from 'element-plus'
import { trashApi } from 'dp-api'
const props = defineProps<{
    selected: any
}>()
const emits = defineEmits(['success'])
const { t } = useI18n()
function deleteSelected () {
    ElMessageBox.confirm(`${t('msg_confirmWhetherToDelete')}`)
    .then(async() => {
        const noti = ElNotification({
            title: t('delete'),
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
onMounted(() => {
})
</script>