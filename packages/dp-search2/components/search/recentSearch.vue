<template>
    <div>
        <h3>{{ $t('search.recentSearchs') }}</h3>
        <div class="main">
            <!-- textSearchType -->
            <el-card v-for="(item,index) in state.recentSearchs" :key="index"
                @click="emits('setSearchParams', item.searchRequestDTO)">
                <template v-for="(qItem, qkey) in item.searchRequestDTO">
                    <el-tag v-if="qItem && !['pageSize'].includes(qkey)" class="el-icon--left">
                        {{ $t(`search.${qkey}`) }}: 
                        <b> {{ getI18n(qItem, qkey) }}</b>
                    </el-tag>
                </template>
                <!-- <el-divider /> -->
                <!-- <div> {{ $t('search.result') }}:{{ item.totalSize }}</div> -->
            </el-card>
        </div>
        <el-button v-if="state.showMore" :loading="state.loading" text @click="getRecentSearchPage">{{ $t('button.more') }}...</el-button>
    </div>
</template>
<script lang="ts" setup>
import { GetRecentSearchPageApi } from "dp-api";
const emits = defineEmits(['setSearchParams'])

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
    try {
        const { entryList, totalSize } = await GetRecentSearchPageApi(pageParams)
        state.recentSearchs.push(...entryList)
        state.showMore = state.recentSearchs.length < totalSize
    } catch (error) {
    }
    state.loading = false
}
function hadnleRefresh() {
    pageParams.pageNum = -1
    state.recentSearchs = []
    getRecentSearchPage()
}
function getI18n(value: any, key:string) {
    console.log(value, key);
    return value
}
onMounted(() => {
    getRecentSearchPage()
})
defineExpose({
    hadnleRefresh
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