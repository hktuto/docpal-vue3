<template>
    <div class="searchContainer" @mouseleave="blurInput">
        <div :class="{inputContainer:true, dropdownOpened}" @mouseenter="focusInput">
            <ElIcon><Search /></ElIcon>
            <input ref="inputEl" :value="keyword" :placeholder="$t('search_keyword')" @input="keywordInputHandler"  />
            <ElIcon class="filterIcon" @click="openFilter"><Operation /></ElIcon>
        </div>
        <div v-if="dropdownOpened" class="popUpDialog">
            <div class="filterContainer">
                <SearchFilter />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {Search, Operation} from '@element-plus/icons-vue';
import { watchDebounced } from '@vueuse/core'
const show = ref(false);

const inputEl = ref();
const searchForm = ref({});

const searchStore = useSearch();

//#region  dialog 
const optionOpened = ref(false);
const filterOpened = ref(false);
const dropdownOpened = computed(() => {
    return optionOpened.value || filterOpened.value;
})

function openFilter(){
    filterOpened.value = true;
}
//#endregion

function focusInput() {
    inputEl.value.focus();
}
function blurInput() {
    inputEl.value.blur();
}
function keywordInputHandler() {
    keyword.value = inputEl.value.value;
}

watchDebounced(searchForm, (newKeyword, oldKeyword) => {
    console.log(newKeyword, oldKeyword)
},{ debounce: 200, maxWait: 500 },)

</script>

<style lang="scss" scoped>
.searchContainer{
    display: block;
    width: 100%;
    overflow: visible;
    position: relative;
}
.inputContainer{
    --radius: var(--el-border-radius-base);
    width: 100%;
    max-width: 600px;
    padding: calc(var(--app-padding) * 0.8);
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    gap: 4px;
    justify-content: flex-start;
    align-items: center;
    border: 1px solid var(--color-grey-800);
    border-radius: var(--radius);
    transition: all .2s ease-in-out;
    input {
        width: 100%;
        font-size: 0.8rem;
        border:none;
        background: transparent;
        &:focus{
            outline: none;
        }
    }
    &:hover, &:focus-within {
        border-color: var(--color-grey-000);
        background-color: var(--color-grey-000);
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    &.dropdownOpened {
        border-radius: var(--radius) var(--radius) 0 0 ;
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
</style>