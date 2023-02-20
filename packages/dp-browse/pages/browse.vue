<template>
    <NuxtLayout >
        <div class="browsePageContainer">
            <BrowseBreadcrumb :path="routePath" rootPath="/"/>
            <BrowseTable :path="routePath" />
        </div>
    </NuxtLayout>
</template>


<script lang="ts" setup>
const route = useRoute();
const routePath = computed( () => route.query.path || '/')
const { data, refresh, pending} = await useAsyncData(() => GetDocDetail(route.query.path));
</script>

<style lang="scss" scoped>
.browsePageContainer{
    padding: var(--el-component-size-small);
    display: grid;
    grid-template-rows: min-content min-content 1fr;
    gap : var(--el-component-size-small);
    height: 100%;
    overflow: hidden;
}
</style>