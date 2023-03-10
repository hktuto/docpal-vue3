<template>
    <NuxtLayout >
        <page-container>
        <div class="browsePageContainer">
            <BrowseBreadcrumb ref="breadCrumb" :path="routePath" rootPath="/" />
            <BrowseTable :path="routePath" :doc="data"/>
        </div>
        <SvgIconSelector v-model:src="icon" />
        <template v-if="data && !data.isFolder">
            <BrowseDetail :show="!data.isFolder" :doc="data" @close="detailClosed" />
        </template>
        </page-container>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { GetDocDetail } from 'dp-api'
const breadCrumb = ref();
const icon = ref("");
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
    display: grid;
    grid-template-rows: min-content min-content 1fr;
    gap : var(--app-padding);
    height: 100%;
    overflow: auto;
}
</style>