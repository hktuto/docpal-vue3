<template>
    <NuxtLayout class="fit-height bc-grey" :backPath="route.query.searchBackPath" :showSearch="false">
        <div :class="['withPadding','search-page',{ 'search-page-narrow': !state.expanded}]">
            <div class="search-container">
                <SearchBar2 ref="SearchBar2Ref" :exportButton="state.showExportButton"
                    @search="handleSearch"
                    @setSearchParams="handleSetTableSearchParams"></SearchBar2>
                <SearchTable ref="SearchTableRef" @filterChange="handleFilterChange"
                    @loadingChange="handleLodingChange"></SearchTable>
            </div>
            <div class="search-page-divider">
                <el-button data-testid="search-zoom-button" :class="['zoom-button', state.expanded ? 'button-expanded':'button-narrow']" type="info" :icon="ArrowLeftBold" circle
                    @click="state.expanded = !state.expanded"/>
            </div>
            <div class="search-container-right">
                <SearchRecentDoc ref="SearchRecentDocRef" class="recent-doc-container"></SearchRecentDoc>
                <SearchRecentSearch ref="SearchRecentSearchRef" class="recent-search-container" @setSearchParams="handleSetSearchParams"></SearchRecentSearch>
            </div>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { ArrowLeftBold } from '@element-plus/icons-vue';
import { } from 'dp-api'
// #region module: page
    const route = useRoute()
    const router = useRouter()
    const state = reactive<any>({
        expanded: true,
        loading: false,
        showExportButton: false
    })
// #endregion

// #region module: search form
    const SearchTableRef = ref()
    function handleSearch(searchParams: any) {
        SearchTableRef.value.handleSearch(searchParams)
    }
// #endregion
const SearchBar2Ref = ref()
async function handleSetSearchParams(searchParams: any) {
    await SearchBar2Ref.value.handleChangeParams({...searchParams}, true)
    SearchBar2Ref.value.handleSearch()
}
function handleFilterChange(searchParams: any) {
    console.log({ ...searchParams });

    SearchBar2Ref.value.handleChangeParams({ ...searchParams })
}
const SearchRecentDocRef = ref()
const SearchRecentSearchRef = ref()
function handleLodingChange(loading: boolean, showExportButton: boolean = false) {
    state.showExportButton = showExportButton
    SearchBar2Ref.value.setLoading(loading)
    if(!loading) {
        // SearchRecentDocRef.value.hadnleRefresh()
        SearchRecentSearchRef.value.hadnleRefresh()
    }
}

function handleSetTableSearchParams(searchParams: any) {
    SearchTableRef.value.setSearchParams(searchParams)
}
onMounted(() => {
})
</script>

<style lang="scss" scoped>
.search-page {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr min-content min-content ;
    grid-template-rows: 1fr;
    transition: all 0.5s;
    overflow: hidden;
    position: relative;
    .search-container {
        grid-area: 1 / 1 / 3 / 2;
        display: grid;
        grid-template-rows: min-content 1fr;
        gap: var(--app-padding);
        position: relative;
    }
    .search-page-divider { grid-area: 1 / 2 / 3 / 3; }
    .search-container-right {
        grid-area: 1 / 3 / 2 / 4;
        max-width: 400px;
        overflow: auto;
        overflow-x: hidden;
        padding-right: var(--app-padding);
    }
    @media(max-width : 1024px) {
        display: unset;
        overflow: auto;
        .search-page-divider { display: none; }
    }

}
.search-page-narrow {
    grid-template-columns: 1fr min-content 0 ;
    grid-template-rows: 1fr 1fr;
    transition: all 0.5s;
}
.search-page-divider {
    position: relative;
    margin: 0 15px;
    border-left: 1px solid #ddd;
    .zoom-button {
        position: absolute;
        top: 1px;
        left: -10px;
        width: 15px;
        height: 15px;
    }
    .button-narrow {
        transition: all 0.5s;
    }
    .button-expanded {
        transform: rotate(180deg);
        transition: all 0.5s;
    }
}
.recent-search-container , .recent-doc-container{
    overflow: hidden;
    min-width: 300px;
    :deep h3 {
        color: var(--color-grey-300);
    }
    :deep(.main) {
        padding-right: var(--app-padding);
        overflow: auto;
    }
    @media(max-width : 1024px) {
        min-width: unset;
    }
}
</style>
