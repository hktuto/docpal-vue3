<template>
    <NuxtLayout >
        <page-container>
        <div v-if="data" class="browsePageContainer">
            <BrowseBreadcrumb ref="breadCrumb" :path="routePath" rootPath="/" />
            <BrowseTable :path="routePath" :doc="data"/>
        </div>
        <Teleport v-if="data && !data.isFolder" to="body">
            <BrowseDetail :show="!data.isFolder" :doc="data" @close="detailClosed" />
        </Teleport>
        </page-container>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { GetDocDetail } from 'dp-api'
const breadCrumb = ref();
const icon = ref("");
const route = useRoute();
const data = ref();
const loading = ref(false)

const routePath = computed( () => (route.query.path as string) || '/')
async function getDocDetail() {
  loading.value = true;
     data.value = await GetDocDetail(routePath.value);
     loading.value = false;
}
watch(route, () => getDocDetail(),{immediate:true});



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
