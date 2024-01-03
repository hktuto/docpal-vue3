<template>
    <div>
        <h3>{{ $t('search.recentSearchs') }}</h3>
        <div class="main">
            <!-- textSearchType -->
            <el-card v-for="(item,index) in state.recentSearchs" :key="index"
                @dblclick="emits('setSearchParams', item.searchRequestDTO)">
                <template v-for="(qItem, qkey) in item.searchRequestDTO">
                    <el-tag v-if="qItem && !['pageSize'].includes(qkey)" class="el-icon--left"
                     :title="getI18n(qItem, qkey)">
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
import { 
    getConditionStore, 
} from '../../utils/searchBar2'
const emits = defineEmits(['setSearchParams'])

const pageParams = reactive({
    pageNum: -1,
    pageSize: 10
})
const state = reactive<any>({
    loading: false,
    recentSearchs: [],
    showMore: false,
    conditionStore: {},
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
    if(!value) return '-'
    const _value = value instanceof Array ? value : [value]
    if(['height','width','duration','assetType','size','modified','textSearchType'].includes(key)) {
        return _value.map(v => $t(`searchType.${v}`)).join(',')
    } else if(['orderBy'].includes(key)) {
        return _value.map(v => $t(`search.${v}`)).join(',')
    }
    else if(['isDesc'].includes(key)) {
        return _value.map(v => $t(`searchType.desc${v}`)).join(',')
    }
    else if(['collections'].includes(key) && state.conditionStore[key]) {
        const conditionLabels = _value.reduce((prev, v) => {
            const optionItem = state.conditionStore[key].optionItems.find((oItem: any) => oItem.value === v)
            if (optionItem) prev.push(optionItem.label)
            return prev
        }, []);
        return conditionLabels.join(',')
    }
    return _value.join(',')
}
onMounted(async() => {
    getRecentSearchPage()
    state.conditionStore = await getConditionStore()
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
.el-tag {
    max-width: 100%;
    overflow: hidden;
    :deep(.el-tag__content) {
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: block;
    }
}
</style>