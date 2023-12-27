<template>
    <div ref="searchBarRef" class="search-bar">
        <div> <b>{{$t('searchBar.title')}} :</b> </div>
        <template v-if="state.dynamicTags">
            <el-tag
                v-for="(item,index) in state.dynamicTags"
                :key="index"
                class="mx-1"
                :data-testid="`search-bar-item-${item}`"
                :closable="!['textSearchType'].includes(item)"
                :disable-transitions="false"
                @close="handleClose(item)"
            >
                <el-popover popper-class="search-bar-popover" placement="bottom-end" trigger="click">
                    <template #reference>
                        {{getSearchI18n(item)}}:{{ getSearchTag(item) }}
                    </template>
                    <SearchBarForm :tag="item" :titles="getSearchI18n(item)" :searchParams="searchParams"
                        :aggregation="aggregation"
                        @change="handleChangeTag"></SearchBarForm>
                </el-popover>
            </el-tag>
        </template>
        <el-dropdown v-if="pendingTags && pendingTags.length > 0" :hide-on-click="false" trigger="click">
            <el-button v-if="pendingTags.length > 0" data-testid="searchBar-add-button" type="info" :icon="Plus" circle size="small"></el-button>
            <template #dropdown>
                <el-dropdown-menu class="search-bar-dropdown-menu">
                    <el-dropdown-item v-for="item in pendingTags" :key="item" @click="handleSelectDataMap(item)"> 
                        <el-dropdown class="search-bar-dropdown" popper-class="hidePopoverBorder" :hide-on-click="false"
                            placement='right-start' trigger="click">
                            <div :data-testid="`search-bar-menuItem-${item}`" class="search-bar-dropdown-item"> {{getSearchI18n(item)}} </div>
                            <template v-if="state.selectedMenuItem === item" #dropdown>
                                <SearchBarForm :tag="item" :titles="getSearchI18n(item)" :searchParams="searchParams"
                                    :aggregation="aggregation"
                                    @change="handleAddTag"></SearchBarForm>
                            </template>
                        </el-dropdown>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script lang="ts" setup>
import { deepCopy, getJsonApi, getSearchParamsArray, GetSCollectionsApi, GetSSIncludeFolderApi } from 'dp-api'
import { Plus } from "@element-plus/icons-vue";
import { watchDebounced } from '@vueuse/core'
const props = defineProps<{
    searchParams: any,
    ready: boolean,
    loading: boolean,
    aggregation: any
}>()
const emits = defineEmits(['change', 'updateForm'])
const router = useRouter()
const route = useRoute()
const state = reactive({
    dynamicTags: [],
    defaultTagList: [
        'paramsInTextSearch',
        'textSearchType',
        'assetType',
        'type',
        'creator',
        'authors',
        'includeFolder',
        'modified',
        'size',
        'collections',
        'tags'
    ],
    i18nMap: {
        'paramsInTextSearch': 'search_keyword',
        'textSearchType': 'searchType',
        'assetType': 'search_assetType',
        'type': 'search_documentType',
        'creator': 'search_authors',
        'authors': 'search_contributors',
        'includeFolder': 'search_includeFolder',
        'modified': 'search_modificationDate',
        'size': 'search_size',
        'collections': 'search_collections',
        'tags': 'search_tags',
    },
    selectedMenuItem: '',
    collectionMap: {}
})
const arrParams = ['or', 'type', 'authors', 'collections', 'tags', 'creator']

const pendingTags = computed(() => {
    return state.defaultTagList.filter(item => !state.dynamicTags.includes(item))
})
function getSearchI18n(tag: string) {
    if(state.i18nMap[tag]) return $t(state.i18nMap[tag])
    return tag
}
function getSearchTag(tag: string) {
    if(!props.searchParams || !props.searchParams[tag] && tag !== 'includeFolder') return ''
    const value = props.searchParams[tag] instanceof Array ? props.searchParams[tag] : [props.searchParams[tag]]
    return value.reduce((prev, item, index) => {
        switch (tag) {
            case 'assetType':
            case 'textSearchType':
            case 'modified':
            case 'size':
                item = $t('searchType_'+item)
                break;
            case 'includeFolder':
                if (item || item === false) item = item ? $t('searchType_includeFolder_1') : $t('searchType_includeFolder_0')
                break
            case 'collections':
                item = state.collectionMap[item] ? state.collectionMap[item] : item
            default:
                break;
        }

        let join = index === value.length - 1 ? '' : ','
        prev += $t(item) + join
        return prev
    }, '')
}
function handleClose (tag: string) {
    state.dynamicTags.splice(state.dynamicTags.indexOf(tag), 1)
    const _searchParams = { ...props.searchParams }
    _searchParams[tag] = arrParams.includes(tag) ? [] : ''
    goRoute(_searchParams)
}
function handleAddTag(key: string, value: any) {
    state.dynamicTags.push(key)
    handleChangeTag(key, value)
}
function handleChangeTag(key: string, value: any) {
    const _searchParams = {...props.searchParams }
    _searchParams[key] = arrParams.includes(key) ? value : value.join(',')
    goRoute(_searchParams)
}
function handleSelectDataMap(tag: string) {
    state.selectedMenuItem = tag
}
function goRoute(sp) {
    const searchBackPath = route.query.searchBackPath || ''
    const time = route.query.time
    router.push({
        query: {
            ...sp,
            pageSize: 20,
            currentPageIndex: 1,
            searchBackPath,
            time
        }
    })
    setTimeout(() => {
        // emits('updateForm')
    }, 1000)
}
function init(sp) {
    state.dynamicTags.splice(0, state.dynamicTags.length)
    const _sp = deepCopy(sp)
    if (_sp.includeFolder || _sp.includeFolder === false) _sp.includeFolder = _sp.includeFolder ? 'true' : 'false'
    Object.keys(_sp).forEach(key => {
        if (!_sp[key]) return
        else if (_sp[key] instanceof Array && state.i18nMap[key]) {
            if (_sp[key].length > 0) state.dynamicTags.push(key)
        } else if(state.i18nMap[key]){
            state.dynamicTags.push(key)
        }
    })
    
    setTimeout(() => {
        if(state.dynamicTags.length > 0) emits('updateForm')
    })
}
onMounted(async() => {
    const collections = await GetSCollectionsApi()
    state.collectionMap = collections.reduce((prev, item) => {
        prev[item.value] = item.label
        return prev
    }, {})
})
watch( ()=> props.searchParams,(newValue, oldValue) => {
    const nSP = deepCopy(newValue)
    const oSP = deepCopy(oldValue)
    if(nSP) {
        delete nSP.time
        delete nSP.currentPageIndex
        delete nSP.pageSize
    }
    if(oSP) {
        delete oSP.time
        delete oSP.currentPageIndex
        delete oSP.pageSize
    }
    const isEqual = JSON.stringify(nSP) === JSON.stringify(oSP)
    if(!isEqual && props.searchParams) init(props.searchParams)
}, { deep: true, immediate: true })
defineExpose({ init })
</script>

<style lang="scss" scoped>
.search-bar {
    display: flex;
    align-items: center;
    gap: var(--app-padding);
    flex-wrap: wrap;
}
.showPopoverBorder {

}

</style>
<style>
.hidePopoverBorder {
    border: unset!important;;
}
.search-bar-popover {
    width: fit-content!important;
}
.search-bar-dropdown {
    width: 100%;
}
.search-bar-dropdown-item {
    width: 100%;
    padding: calc(var(--app-padding) / 1.5) var(--app-padding);
}
.search-bar-dropdown-menu .el-dropdown-menu__item {
    padding: unset;
}
</style>
