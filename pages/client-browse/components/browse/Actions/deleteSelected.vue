<template>
    <SvgIcon src="/icons/file/delete.svg" round content="delete"
        @click="deleteSelected()"></SvgIcon>
</template>

<script lang="ts" setup>
import { Loading } from '@element-plus/icons-vue';
import { ElNotification, ElMessageBox } from 'element-plus'
import { trashApi } from 'dp-api'
const props = defineProps<{
    selected: any
}>()
const emits = defineEmits(['success'])

function deleteSelected () {
    ElMessageBox.confirm(`${$i18n.t('msg_confirmWhetherToDelete')}`)
    .then(async() => {
        const noti = ElNotification({
            title: $i18n.t('delete'),
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