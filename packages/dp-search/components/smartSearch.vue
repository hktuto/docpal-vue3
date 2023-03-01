<template>
    <div class="searchContainer" @mouseleave="blurInput" @mouseenter="elHoverHandler">
        <div ref="wrapper" class="wrapper">
            <div :class="{inputContainer:true, dropdownOpened}" @mouseenter="focusInput">
                <ElIcon><Search /></ElIcon>
                <input ref="inputEl" :value="keyword" :placeholder="$t('search_keyword')" @input="keywordInputHandler"  />
                <ElIcon class="filterIcon" @click="openFilter"><Operation /></ElIcon>
            </div>
            <div  :class="{popUpDialog:true, dropdownOpened}">
                <SearchFilter v-if="filterOpened" @closed="filterOpened = false"/>
                <SearchShortResult v-if="optionOpened" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {Search, Operation} from '@element-plus/icons-vue';
import { watchDebounced, onClickOutside } from '@vueuse/core'
const show = ref(false);

const inputEl = ref();
const wrapper = ref();
const {searchFilter, search} = useSearch();

//#region  dialog 
const optionOpened = ref(false);
const filterOpened = ref(false);
const dropdownOpened = computed(() => {
    return optionOpened.value || filterOpened.value;
})

function openFilter(){
    filterOpened.value = true;
}
onClickOutside(wrapper, (event) => {
    if(dropdownOpened.value) {
        optionOpened.value = false;
        filterOpened.value = false;
    }
})
//#endregion
function elHoverHandler() {
    
}
function focusInput() {
    inputEl.value.focus();
}
function blurInput() {
    inputEl.value.blur();
}
const keyword = ref("");
function keywordInputHandler() {
    keyword.value = inputEl.value.value;
}



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
    width: 100%;
    max-width: 600px;
    position: relative;
    isolation: isolate;
    
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
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        
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