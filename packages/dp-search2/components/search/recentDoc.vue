<template>
    <div>recentDoc
        {{ state.recentDocuments }}
    </div>
</template>
<script lang="ts" setup>
import { GetRecentDocumentPageApi } from "dp-api";

const pageParams = reactive({
    pageNum: -1,
    pageSize: 10
})
const state = reactive<any>({
    loading: false,
    recentDocuments: [],
    showMore: false
})
async function getRecentDocumentPage() {
    pageParams.pageNum ++
    state.loading = true
    const { entryList, totalSize } = await GetRecentDocumentPageApi(pageParams)
    state.recentDocuments.push(...entryList)
    state.showMore = state.recentDocuments.length < totalSize
}
onMounted(() => {
    getRecentDocumentPage()
})
</script>
<style lang="scss" scoped>
</style>