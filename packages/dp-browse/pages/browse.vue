<template>
    <NuxtLayout >
        <template v-slot:header>
            <div class="action">header slots</div>
        </template>
        <BrowseHeader class="header" :path="routePath" />
        <BrowseBreadcrumb :path="routePath" />
        <BrowseTable :path="routePath" />
    </NuxtLayout>
</template>


<script lang="ts" setup>
const route = useRoute();
const routePath = computed( () => route.params.path || '/')

</script>

<style lang="scss" scoped>
.browsePageContainer{
    padding: var(--el-component-size-small);
    display: grid;
    grid-template-columns: 1fr;
    gap : var(--el-component-size-small);
    height: 100%;
    overflow: hidden;
}
</style>