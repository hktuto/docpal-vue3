<template>
    <NuxtLayout class="fit-height withPadding bc-grey" :backPath="route.query.searchBackPath" :showSearch="false">
        <div :class="['search-page',{ 'search-page-narrow': !state.expanded}]">
            <div class="search-container">
                <SearchBar2 @search="handleSearch">bar</SearchBar2>
                <SearchTable></SearchTable>
            </div>
            <div class="search-page-divider">
                <el-button data-testid="search-zoom-button" :class="['zoom-button', state.expanded ? 'button-expanded':'button-narrow']" type="info" :icon="ArrowLeftBold" circle 
                    @click="state.expanded = !state.expanded"/>
            </div>
            
            <SearchRecentDoc class="recent-doc-container"></SearchRecentDoc>
            <SearchRecentSearch class="recent-search-container"> recent-search-container </SearchRecentSearch>
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
    })
// #endregion

// #region module: search form
    function handleSearch(searchParams: any) {
        console.log({searchParams})
    }
// #endregion
onMounted(() => {
})
</script>

<style lang="scss" scoped>
.search-page {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr min-content min-content ;
    grid-template-rows: 1fr 1fr;
    transition: all 0.5s;
    overflow: hidden;
    position: relative;
    .search-container { 
        grid-area: 1 / 1 / 3 / 2; 
        display: grid;
        grid-template-rows: min-content 1fr;
        gap: var(--app-padding)
    }
    .search-page-divider { grid-area: 1 / 2 / 3 / 3; }
    .recent-doc-container { grid-area: 1 / 3 / 2 / 4; }
    .recent-search-container { grid-area: 2 / 3 / 3 / 4; }
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
        transform: rotate(180deg);
        transition: all 0.5s;
    }
    .button-expanded {
        transition: all 0.5s;
    }
}
.recent-search-container {
    overflow: auto;
    min-width: 300px;
    padding-right: 5px;
    @media(max-width : 1024px) {
        min-width: 200px;
    }
}
</style>
