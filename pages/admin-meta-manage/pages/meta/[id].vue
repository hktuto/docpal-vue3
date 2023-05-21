<template>
<NuxtLayout class="fit-height withPadding" backPath="/meta">
    <div class="metaSetting-container">
        <MetaInfo :docType="state.docType"></MetaInfo>
        <MetaDisplayMeta></MetaDisplayMeta>
        <MetaRelatedType></MetaRelatedType>
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
}
</style>