<template>
    <div>
        <div>{{ $t('search.recentSearchs') }}</div>
        <div>
            <!-- textSearchType -->
            <el-card v-for="(item,index) in state.recentSearchs" :key="index">
                <template v-for="(qItem, qkey) in item.searchRequestDTO">
                    <el-tag v-if="qItem && !['pageSize'].includes(qkey)">
                        {{ qkey }}: 
                        <b>{{ qItem }}</b>
                    </el-tag>
                </template>
                <el-divider />
            </el-card>
        </div>
        <el-button></el-button>
    </div>
</template>
<script lang="ts" setup>
import { GetRecentSearchPageApi } from "dp-api";

const pageParams = reactive({
    pageNum: -1,
    pageSize: 10
})
const state = reactive<any>({
    loading: false,
    recentSearchs: [],
    showMore: false
})
async function getRecentSearchPage() {
    pageParams.pageNum ++
    state.loading = true
    const { entryList, totalSize } = await GetRecentSearchPageApi(pageParams)
    state.recentSearchs.push(...entryList)
    state.showMore = state.recentSearchs.length < totalSize
}
onMounted(() => {
    getRecentSearchPage()
})
</script>
<style lang="scss" scoped>
.el-card {
    margin-bottom: var(--app-padding);
    :deep(.el-card__body) {
        padding: var(--app-padding);
    }
    .el-divider {
        margin: var(--app-padding) 0;
    }
}
</style>