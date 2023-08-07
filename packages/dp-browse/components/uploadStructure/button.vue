<template>
<!--  v-if="uploadRequestList && uploadRequestList.length > 0" -->
  <SvgIcon src="/icons/file/upload.svg" round content="upload"></SvgIcon>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { useEventListener } from '@vueuse/core'
import {  CreateDocumentApi } from 'dp-api'
const { uploadRequestList } = useUploadStore()
const state = reactive({

})
</script>
<style lang="scss" scope>
</style>
