<template>
    <NuxtLayout >
        <div class="browsePageContainer">
            <BrowseBreadcrumb ref="breadCrumb" :path="routePath" rootPath="/" />
            <Table></Table>
        </div>
    </NuxtLayout>
</template>


<script lang="ts" setup>
const breadCrumb = ref();
const route = useRoute();
const routePath = computed( () => route.query.path || '/')
const { data, refresh, pending} = await useAsyncData(() => GetDocDetail(route.query.path));
watch(route, () => refresh());


function detailClosed() {
    breadCrumb.value.goParent();
}
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