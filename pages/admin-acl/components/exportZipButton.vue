<template>
    <SvgIcon :src="'/icons/bulkExport.svg'" @click="handleExport" />
</template>


<script lang="ts" setup>
import { exportFolderStructureApi } from 'dp-api';
import {ElNotification} from 'element-plus'
    const props = defineProps<{
        exportId:string,
        exportName: string,
    }>()

  async function handleExport(){
    const noti = ElNotification({
        title: '',
        dangerouslyUseHTMLString: true,
        message: `downloading ~ ${props.exportName}`,
        showClose: false,
        customClass: 'loading-notification',
        duration: 0,
        position: 'bottom-right'
      });
      const res = await exportFolderStructureApi(props.exportId, props.exportName)
      noti.close()
  }

  </script>
