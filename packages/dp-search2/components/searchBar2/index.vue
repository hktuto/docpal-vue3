<template>
<div class="searchBar-container" @mouseleave="handleClearInputValue">
    <div class="searchBar-main">
        <SearchBar2AssetType v-model:assetType="state.assetType" />
        <el-tag
            v-for="tag in state.dynamicTags"
            :key="tag.key"
            class="mx-1"
            closable
            @close="handleClose(tag)"
            >
            <!-- size="large" -->
            <b>{{ $t(tag.label) }}:  </b>{{ tag.value }}
        </el-tag>
        <el-input v-model="state.inputValue" clearable></el-input>
        <el-button type="primary" :loading="state.loading" @click="handleSearch">{{ $t('search') }}
            <el-icon class="el-icon--right"><Search /></el-icon>
        </el-button>
        <el-button v-if="exportButton" type="primary" @click="emits('export')">{{ $t('export') }}</el-button>
    </div>
    <SearchBar2Suggestion :inputValue="state.inputValue" :suggestList="state.suggestList"
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
    GetSTypesApi,
    GetKeyCloakAllUsersApi,
    GetSCollectionsApi,
    GetSTagsApi,
    GetSModifiedDateApi,
    GetSSizeApi,
} from 'dp-api'
const props = defineProps(['exportButton'])
const emits = defineEmits(['export', 'search'])
const state = reactive<any>({
    assetType: '',
    inputValue: '',
    searchParams: {
    },
    conditionStore: [],
    suggestList: [],
    suggestFilterList: [],
    suggestKeywordList: [],
    
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
function handleSearch() {
    state.loading = true
    const searchParams = { ...state.searchParams }
    if ( state.assetType) searchParams.assetType = state.assetType
    emits('search', searchParams)
    setTimeout(() => {
        state.loading = false
    }, 3000);
}
function handleClose(tagItem: any) {
    state.searchParams[tagItem.key] = ''
    getTags()
}
function getTags () {
    state.dynamicTags = Object.keys(state.searchParams).reduce((prev:any, key: string) => {
        if(key === 'paramsInTextSearch') {
            prev.push({
                label: 'search_keyword',
                key: 'paramsInTextSearch',
                value: state.searchParams[key]
            })
        } else {
            let tagItem: any = state.searchParams[key] ? [...state.searchParams[key]] : ''
            if(tagItem) {
                if(['type', 'size', 'modified', 'collections'].includes(key)) {
                    const optionItems = state.conditionStore[key].optionItems
                    tagItem = tagItem.reduce((prev: string[], value: string) => {
                        const optionItem = optionItems.find((c: any) => c.value === value)
                        prev.push(optionItem.label)
                        return prev
                    }, [])
                }
                prev.push({
                    label: state.conditionStore[key].label,
                    key: key,
                    value: tagItem instanceof Array ? tagItem.join(',') : tagItem
                })
            }
        }
        return prev
    }, [])
}
async function getOptions() {
    state.conditionStore = {
        type :{ 
            name: 'type', 
            label: 'search_documentType',
            filter: true,
            optionItems: await GetSTypesApi()
        },
        collections: {
            name: 'collections', 
            label: 'search_collections',
            filter: true,
            optionItems: await GetSCollectionsApi()
        },
        tags: {
            name: 'tags', 
            label: 'search_tags',
            filter: true,
            optionItems: await GetSTagsApi()
        },
        creator: { 
            name: 'creator', 
            label: 'search_authors',
            filter: true,
            optionItems: await GetKeyCloakAllUsersApi()
        },
        authors: { 
            name: 'authors', 
            label: 'search_contributors',
            filter: true,
            optionItems: await GetKeyCloakAllUsersApi()
        },
        modified: { 
            name: 'modified', 
            label: 'search_modificationDate',
            optionItems: await GetSModifiedDateApi(),
            max: 1
        },
        size: { 
            name: 'size', 
            label: 'search_size',
            optionItems: await GetSSizeApi()
        }
    }
    getSuggestList()
    getKeywords()
}
function getKeywords() {
    state.suggestKeywordList = Object.keys(state.conditionStore).reduce((prev: any[],key: string) => {})
}

function getSuggestList() {
    state.suggestList = Object.keys(state.conditionStore).reduce((prev: any[],key: string) => {
        const sItem = state.conditionStore[key]
        sItem.optionItems.forEach((pItem: any) => {
            if (pItem.children) {
                pItem.children.forEach((cItem: any) => {
                    prev.push({
                        label: sItem.label,
                        key: sItem.name,
                        optionLabel: cItem.label,
                        optionValue: cItem.value
                    })
                })
            }
            else prev.push({
                label: sItem.label,
                key: sItem.name,
                optionLabel: pItem.label,
                optionValue: pItem.value
            })
        });
        return prev
    }, [])
}
onMounted(() => {
    getOptions()
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