<template>
<div class="searchBar-container" @mouseleave="handleClearInputValue">
    <div class="searchBar-main">
        <SearchBar2AssetType v-model:assetType="searchConfig.assetType" />
        <searchBar2ConditionTag :dynamicTags="state.dynamicTags"
            :conditionStore="state.conditionStore"
            :textSearchType="searchConfig.textSearchType"
            @change="handleChangeParams"
            @handleClose="handleRemoveParams"/>
        <el-input v-model="state.inputValue" style="min-width: 100px;" clearable></el-input>
        <el-button type="primary" :disabled="!state.dynamicTags || state.dynamicTags.length === 0" :loading="state.loading" @click="handleSearch">{{ $t('search.text') }}
            <el-icon class="el-icon--right"><Search /></el-icon>
        </el-button>
        <el-button v-if="exportButton" type="primary" @click="emits('export')">{{ $t('search.export') }}</el-button>
    </div>
    <SearchBar2Suggestion :inputValue="state.inputValue" 
        :suggestList="state.suggestList"
        :suggestKeywordList="state.suggestKeywordList"
        @adoptSuggestion="handleAdoptSuggestion"/>
    <!-- <div></div> -->
    <el-icon :class="['ArrowDownBold', state.expanded ? 'icon-expanded':'icon-narrow']" 
        @click="state.expanded = !state.expanded"><ArrowDownBold /></el-icon>
    <div :class="['condition-container',{ 'condition-container-narrow': !state.expanded}]">
        <SearchBar2Condition class="h-200" v-for="item in state.conditionStore" :key="item.name" 
            v-model="state.searchParams[item.name]" 
            v-bind="item"
            @change="getTags"/>
    </div>
</div>
</template>
<script lang="ts" setup>
import { ArrowDownBold, Search  } from '@element-plus/icons-vue';
import { 
    getConditionStore, 
    getSuggestKeywordList,
    getSuggestList
} from '../../utils/searchBar2'
const props = defineProps(['exportButton'])
const emits = defineEmits(['export', 'search'])
const searchConfig = reactive<any>({
    assetType: '',
    textSearchType: 'full text search',
})
const state = reactive<any>({
    inputValue: '',
    searchParams: {
    },
    conditionStore: [],
    suggestList: [], // 推荐列表
    suggestFilterList: [], // 推荐列表过滤数据
    suggestKeywordList: [], // 用于精度推荐
    
    dynamicTags: [],
    loading: false,
    expanded: false
})
function handleAdoptSuggestion(key: string, value: string) {
    if(key !== 'paramsInTextSearch') {
        const isMultiple = state.conditionStore[key].max !== 1
        state.searchParams[key] = isMultiple ? [value] : value
    }
    else {
        state.searchParams[key] = value
    }
    getTags()
    state.inputValue = ''
}
function handleClearInputValue() {
    // setTimeout(() => { state.inputValue = '' }, 200)
}
function handleChangeParams(params: any, reset: boolean = false) {
    if (reset)  state.searchParams = { }
    if (params.textSearchType) {
        searchConfig.textSearchType = params.textSearchType
        delete params.textSearchType
    }
    state.searchParams = { ...state.searchParams, ...params}
    getTags()
}
function handleSearch() {
    state.loading = true
    emits('search', { ...state.searchParams, ...searchConfig })
    setTimeout(() => {
        state.loading = false
    }, 3000);
}
function handleRemoveParams(tagItem: any) {
    state.searchParams[tagItem.key] = ''
    getTags()
}
function getTags () {
    state.dynamicTags = Object.keys(state.searchParams).reduce((prev:any, key: string) => {
        console.log(key);
        
        if(key === 'paramsInTextSearch' && state.searchParams[key]) {
            prev.push({
                label: 'search_keyword',
                key: 'paramsInTextSearch',
                str: state.searchParams[key],
                value: state.searchParams[key]
            })
        } else {
            const isMultiple = state.conditionStore[key].max !== 1
            let tagItem: any = state.searchParams[key] ? 
                                isMultiple ? 
                                [...state.searchParams[key]] : 
                                [state.searchParams[key]] : 
                                ''
            if(tagItem) {
                // 获取翻译
                if(['type', 'size', 'modified', 'collections'].includes(key)) {
                    const optionItems = state.conditionStore[key].optionItems
                    tagItem = tagItem.reduce((prevTags: string[], value: string) => {
                        const optionItem = optionItems.find((c: any) => c.value === value)
                        prevTags.push(optionItem.label)
                        return prevTags
                    }, [])
                }
                prev.push({
                    label: state.conditionStore[key].label,
                    key: key,
                    str: tagItem instanceof Array ? tagItem.join(',') : tagItem,
                    value: isMultiple ? [...state.searchParams[key]] : state.searchParams[key]
                })
            }
        }
        return prev
    }, [])
}

onMounted(async() => {
    state.conditionStore = await getConditionStore()
    state.suggestList = getSuggestList(state.conditionStore)
    state.suggestKeywordList = getSuggestKeywordList(state.conditionStore)
}) 
defineExpose({
    handleChangeParams, handleSearch
})
</script>
<style lang="scss" scoped>
.searchBar-container {
    position: relative;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 8px 36px 0 rgba(104,122,143,0.15);
    border: 1px solid #DBE6EE;
    border-radius: 5px;
    padding: var(--app-padding);
    max-height: 80vh;
    overflow: auto;
    &:hover {
        .ArrowDownBold {
            display: unset;
        }
    }
}
.searchBar-main {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: calc(var(--app-padding) / 2);
    .el-input {
        flex: 1;
        box-sizing: unset;
        :deep .el-input__wrapper {
            box-shadow: unset;
        }
    }
}
.ArrowDownBold {
    display: none;
    position: absolute;
    bottom: 5px;
    right: 50%;
    cursor: pointer;
    color: #b1bac3;
}
.condition-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--app-padding);
    &-narrow {
        height: 0px;
        display: none;
    }
}
.icon-narrow {
    transition: all 0.5s;
}
.icon-expanded {
    display: unset!important;
    transform: rotate(180deg);
    transition: all 0.5s;
}
</style>