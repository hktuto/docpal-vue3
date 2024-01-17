<template>
    <div v-if="state.inputValue || state.expanded" class="searchBar-container-placeholder" ></div>
    <div :class="['searchBar-container', {'searchBar-container-absolute': state.inputValue || state.expanded }]" @mouseleave="handleClearInputValue" ref="searchContainerEl">
        <div class="searchBar-main">
            <SearchBar2AssetType v-model:assetType="searchConfig.assetType" @update:assetType="init(searchConfig.assetType)"/>
            <searchBar2ConditionTag
                :dynamicTags="state.dynamicTags"
                :conditionStore="state.conditionStore"
                :textSearchType="searchConfig.textSearchType"
                @change="handleChangeParams"
                @handleClose="handleRemoveParams"/>
            <el-input v-model="state.inputValue" style="min-width: 100px;" placeholder="Fill in the keyword" @keyup.enter="inputPressEnterHandler"  clearable></el-input>
            <el-button style="z-index: 101;" type="primary" :disabled="!state.dynamicTags || state.dynamicTags.length === 0" :loading="state.loading" @click="() => {handleSearch(); state.expanded = false}">{{ $t('search.text') }}
                <el-icon class="el-icon--right"><Search /></el-icon>
            </el-button>
            <el-button v-if="!!state.dynamicTags && state.dynamicTags.length !== 0" type="primary" @click="handleExport">{{ $t('search.export') }}</el-button>
        </div>
        <SearchBar2Suggestion :inputValue="state.inputValue"
            :suggestList="state.suggestList"
            :suggestKeywordList="state.suggestKeywordList"
            @adoptSuggestion="handleAdoptSuggestion"/>
        <el-affix target=".searchBar-container" :offset="0">
            <el-button :class="['ArrowDownBold', state.expanded ? 'icon-expanded':'icon-narrow']" :icon="ArrowDownBold" text
                @click="state.expanded = !state.expanded"></el-button>
        </el-affix>
        <div :class="['condition-container',{ 'condition-container-narrow': !state.expanded}]">
            <SearchBar2Condition class="h-200" v-for="item in state.conditionStore" :key="item.name"
                v-model="state.searchParams[item.name]"
                v-bind="item"
                @change="getTags"/>
        </div>
    </div>
    <SearchExportDialog ref="SearchDownloadDialogRef" />
</template>
<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import { ArrowDownBold, Search  } from '@element-plus/icons-vue';
import {
    getConditionStore,
    getSuggestKeywordList,
    getSuggestList
} from '../../utils/searchBar2'
const props = defineProps(['exportButton'])
const searchContainerEl = ref(null);
const emits = defineEmits(['export', 'search', 'setSearchParams'])
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
function handleAdoptSuggestion(key: string, value: any) {
    if(key !== 'paramsInTextSearch') {
        const isMultiple = state.conditionStore[key].max !== 1
        state.searchParams[key] = isMultiple ? [value] : value
    }
    else {
        state.searchParams[key] = value
    }
    getTags()
    emits('setSearchParams', { ...state.searchParams, ...searchConfig})
    state.inputValue = ''
  handleSearch();
}
function handleClearInputValue() {
    // setTimeout(() => { state.inputValue = '' }, 200)
}

function inputPressEnterHandler(){
  if(!state.inputValue) return
  console.log('inputPressEnterHandler', state.inputValue)
  state.searchParams['paramsInTextSearch'] = state.inputValue
  getTags()
  emits('setSearchParams', { ...state.searchParams, ...searchConfig})
  state.inputValue = ''
  state.expanded = false
  handleSearch();
}
async function handleChangeParams(params: any, reset: boolean = false) {
    console.log({params});

    if (reset)  {
        state.searchParams = { }
        searchConfig.assetType = ''
        searchConfig.textSearchType = ''
        searchConfig.orderBy = ''
        searchConfig.isDesc = ''
    }
    if (params.textSearchType) {
        searchConfig.textSearchType = params.textSearchType
        delete params.textSearchType
    }
    if (params.assetType) {
        await init(params.assetType)
        searchConfig.assetType = params.assetType
        delete params.assetType
    }
    if (params.orderBy) {
        searchConfig.orderBy = params.orderBy
        delete params.orderBy
    }
    if (params.isDesc || params.isDesc === false) {
        searchConfig.isDesc = params.isDesc
        delete params.isDesc
    }
    state.searchParams = { ...state.searchParams, ...params}
    emits('setSearchParams', { ...state.searchParams, ...searchConfig})
    getTags()
}
function handleSearch() {
    state.loading = true
    if(Object.keys(state.searchParams).length === 0) return
    emits('search', { ...state.searchParams, ...searchConfig })
}
function handleRemoveParams(tagItem: any) {
    state.searchParams[tagItem.key] = ''
    getTags()
}
function getTags () {
    state.dynamicTags = Object.keys(state.searchParams).reduce((prev:any, key: string) => {
        if(['isDesc', 'orderBy', 'assetType', 'textSearchType'].includes(key)) return prev
        if(key === 'paramsInTextSearch' && state.searchParams[key]) {
            prev.push({
                label: 'search.paramsInTextSearch',
                key: 'paramsInTextSearch',
                str: state.searchParams[key],
                value: state.searchParams[key]
            })
        } else if(key !== 'paramsInTextSearch'){
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
                        if(optionItem) prevTags.push(optionItem.label)
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
async function init(assetType?: any) {
    state.conditionStore = await getConditionStore(assetType)
    state.suggestList = getSuggestList(state.conditionStore)
    state.suggestKeywordList = getSuggestKeywordList(state.conditionStore)
}
function setLoading(loading: boolean = false) {
    state.loading = loading

}
const SearchDownloadDialogRef = ref()
function handleExport() {
    SearchDownloadDialogRef.value.handleOpen({ ...state.searchParams, ...searchConfig })
}
onMounted(() => {
    init()
})

watch(state, () => {
    if(state.expanded) {
      onClickOutside(searchContainerEl, evt => state.expanded = false);
    }
},{deep: true})

defineExpose({
    handleChangeParams, handleSearch, setLoading
})
</script>
<style lang="scss" scoped>
.searchBar {
    position: relative;
    min-height: 58px;
}
.searchBar-container {
    max-height: 80vh;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 8px 36px 0 rgba(104,122,143,0.15);
    border: 1px solid #DBE6EE;
    border-radius: 5px;
    padding: var(--app-padding);
    overflow: auto;
    overflow-x: hidden;
    &:hover {
        .ArrowDownBold {
            display: unset;
        }
    }
}
.searchBar-container-placeholder {
    min-height: 58px;
}
.searchBar-container-absolute {
    position: absolute;
    z-index: 100;
    // background-color: red
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
    top: 20px;
    right: 50%;
    cursor: pointer;
    color: #b1bac3;
    &.icon-expanded{
      top: initial;
      bottom:5px;
    }
}
.condition-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: calc(var(--app-padding) * 2 );
    &-narrow {
        height: 0px;
        display: none;
    }
    @media(max-width : 1024px) {
        display: unset;
        overflow: auto;
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
