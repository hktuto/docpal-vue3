<template>
    <div class="searchContainer" @mouseleave="blurInput" @mouseenter="elHoverHandler">
        <div ref="wrapper" :class="{wrapper:true, dropdownOpened: !!dropdownState}">
            <div :class="{inputContainer:true, dropdownOpened: !!dropdownState}" @mouseenter="focusInput">
                <ElIcon><Search /></ElIcon>
                <input ref="inputEl" :value="state.keyword" :placeholder="$t('search_keyword')" 
                    @input="keywordInputHandler"
                    @keyup.enter="keywordEnter()" />
                <ElIcon class="filterIcon" @click="openFilter"><Operation /></ElIcon>
            </div>
            <div  :class="{popUpDialog:true, dropdownOpened: !!dropdownState}">
                <SearchFilter ref="SearchFilterRef" v-show="dropdownState === 'filter'" 
                    :searchParams="state.searchParams"
                    @closed="dropdownState = ''" @submit="handleSubmit"/>
                <!-- <SearchShortResult v-else-if="dropdownState === 'list'" /> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {Search, Operation} from '@element-plus/icons-vue';
import { watchDebounced, onClickOutside } from '@vueuse/core'
import { getSearchParamsArray } from 'dp-api'
import { useMagicKeys, whenever } from '@vueuse/core'
const router = useRouter()
const route = useRoute()
const inputEl = ref();
const state = reactive({
    dropdownState: '', // '' || 'filter' || 'list'
    formOpen: false, // 控制formChange带来的路由跳转
    
    keyword: '',
    searchParams: {
        // paramsInTextSearch: [],
        // textSearchType: '',
        // folderType: '',
        // type: [],
        // modified: '',
        // authors: [],
        // collections: [],
        // tags: [],
        // size: '',
        // pageSize: 20,
        // currentPageIndex: 1
    }
})
const { dropdownState } = toRefs(state)
// #region  dialog 
    const wrapper = ref();
    const SearchFilterRef = ref()
    function keywordEnter () {
        SearchFilterRef.value.handleSubmit()
    }
    function openFilter(){
        state.dropdownState =  'filter'
    }

    onClickOutside(wrapper, (event) => {
        if (isElPopover(event.path)) return
        if(state.dropdownState) {
            state.dropdownState = ''
        }
    })
    function isElPopover(pathList: any) {
        for(var index in pathList) {
            const element = pathList[index]
            if(element && 
                element.className &&
                typeof element.className === 'string' &&
                element.className.includes('el-popper')) return true
            if(index > 5) return false
        }
        return false
    }
// #endregion
function handleSubmit (data) {
    state.searchParams = {
        ...state.searchParams,
        ...data
    }
    if(state.formOpen) return
    goRoute()
}
function goRoute() {
    const searchBackPath = route.query.searchBackPath ? route.query.searchBackPath : route.fullPath
    router.push({
        path: '/search',
        query: { 
            ...state.searchParams, 
            pageSize: 20,
            currentPageIndex: 1,
            searchBackPath 
        }
    })
}
function elHoverHandler() {
    
}
function focusInput() {
    inputEl.value.focus();
}
function blurInput() {
    inputEl.value.blur();
}

function keywordInputHandler(event) {
    const value = event.target.value
    state.keyword = value
    state.searchParams.paramsInTextSearch = [value]
}
// #region module: 
    const { ctrl_f, meta_f } = useMagicKeys({
        passive: false,
        onEventFired(e) {
            if ((e.ctrlKey && e.key === 'f' && e.type === 'keydown') ||
                (e.metaKey && e.key === 'f' && e.type === 'keydown')) 
                e.preventDefault()
        }
    })
    whenever(ctrl_f, () => {
        openFilter()
        focusInput()
    })
     whenever(meta_f, () => {
        openFilter()
        focusInput()
    })
// #endregion
onMounted(() => {
    state.searchParams = getSearchParamsArray(route.query)
    if(state.searchParams.paramsInTextSearch) {
        state.keyword = state.searchParams.paramsInTextSearch.join('')
    }
})

</script>

<style lang="scss" scoped>
.searchContainer{
    display: block;
    width: 100%;
    overflow: visible;
    position: relative;
    
}
.wrapper{
    --input-padding: calc(var(--app-padding) * 0.8);
    --input-height: calc(var(--input-padding) * 2 + 16px);
    --radius: var(--el-border-radius-round);
    --max-width: 400px;
    width: 100%;
    max-width: var(--max-width);
    position: relative;
    isolation: isolate;
    margin:0 auto;
    transition: all .3s ease-in-out;
    &.dropdownOpened{
        --max-width: 800px;
    }
}
.inputContainer{
    
    width: 100%;
    padding: calc(var(--app-padding) * 0.8) var(--app-padding);
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    gap: 4px;
    justify-content: flex-start;
    align-items: center;
    // border: 1px solid var(--color-grey-800);
    border-radius: var(--radius);
    transition: all .2s ease-in-out;
    background-color: var(--color-grey-000);
    input {
        height: 16px;
        width: 100%;
        font-size: 0.8rem;
        border:none;
        background: transparent;
        &:focus{
            outline: none;
        }
    }
    &:hover, &:focus-within, &.dropdownOpened{
        border-color: var(--color-grey-000);
        background-color: var(--color-grey-0000);
        // box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        
    }
}
.filterIcon{
    --padding: 4px;
    padding: var(--padding);
    border-radius: var(--el-border-radius-round);
    color: var(--color-grey-900);
    width: calc(1rem + var(--padding) * 2);
    height: calc(1rem + var(--padding) * 2);
    &:hover {
        background: var(--color-grey-150);
    }
}
.popUpDialog{
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    height: 100%;
    max-height: calc(100vh - 80px);
    background-color: transparent;
    border-radius: var(--radius) ;
    border-color: var(--color-grey-000);
    padding: var(--app-padding); 
    overflow: auto;
    
    z-index: -1;
    transition: all .2s ease-in-out;
    &.dropdownOpened {
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        background-color: var(--color-grey-0000);
        height: auto;
        padding: calc(var(--input-height) + 20px ) var(--app-padding) var(--app-padding) var(--app-padding); 
    }
}
</style>