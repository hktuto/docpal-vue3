<template>
    <div>
        <h3>{{ $t('search.recentDocument') }}</h3>
        <div class="main">
            <div v-for="(item,index) in state.recentDocuments" :key="`${index}-${item.id}`" class="flex-x-start doc-card"
                @click="handlePreview(item)">
                <BrowseItemIcon class="icon el-icon--left" :type="item.isFolder ? 'folder' : 'file'" :mimeType="item.mimeType" status="general"/>
                <div>{{ item.name }}</div>
            </div>
        </div>
        <el-button v-if="state.showMore" :loading="state.loading" text @click="getRecentDocumentPage">{{ $t('button.more') }}...</el-button>
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
function handlePreview(row) {
    openFileDetail(row.id, {
        showInfo:true,
        showHeaderAction:true
    })
}
onMounted(() => {
    getRecentDocumentPage()
})
</script>
<style lang="scss" scoped>
.doc-card {
    cursor: pointer;
    padding: 3px 0;
    border-radius: 5px;
    &:hover {
        background-color: var(--primary-color);
        color: #fff;
    }
}
</style>