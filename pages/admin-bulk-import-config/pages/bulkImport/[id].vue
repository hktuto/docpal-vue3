<template>
<NuxtLayout class="fit-height withPadding" backPath="/bulkImport">
    <div class="metaSetting-container">
        <BulkImportInfo :docType="state.docType"></BulkImportInfo>
        <BulkImportMetaMapping></BulkImportMetaMapping>
        <BulkImportConfig></BulkImportConfig>
    </div>
</NuxtLayout>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { GetMetaSettingApi } from 'dp-api'
const route = useRoute()
const state = reactive({
    docType: {}
})
onMounted(async() => {
    state.docType = await GetMetaSettingApi(route.params.id)
})
</script>

<style lang="scss" scoped>
.metaSetting-container {
    display: grid;
    grid-template-columns: minmax(min-content, 200px) 1fr 1fr;
    gap: var(--app-padding);
    height: 100%;
    overflow: hidden;
  padding : calc( var(--app-padding) * 2);
}
</style>
