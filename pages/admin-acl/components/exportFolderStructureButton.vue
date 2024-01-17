<template>
    <SvgIcon src="/icons/file/export.svg" round @click="handleExport" />
</template>


<script lang="ts" setup>
import { Loading } from '@element-plus/icons-vue';
import { ElNotification, ElMessage } from 'element-plus'
import { exportFolderStructureApi } from 'dp-api'
const props = defineProps<{
    exportId: string
    exportName: string,
}>()
async function handleExport () {
    const noti = ElNotification({
        title: '',
        dangerouslyUseHTMLString: true,
        icon: Loading,
        message: props.exportName,
        showClose: false,
        customClass: 'loading-notification',
        duration: 0,
        position: 'bottom-right'
    });
    const res = await exportFolderStructureApi(props.exportId, props.exportName)
    noti.close()
    // downloadBlob(res, props.exportName)
}
</script>

<style lang="scss" scoped>

</style>
