<template>
    <div class="browsePageContainer">
        <div class="treeContainer">
            <BrowseTree :path="currentPath" />
        </div>
        <div class="browseContentContainer">

        </div>
    </div>
</template>


<script lang="ts" setup>
const route = useRoute();
const currentPath = useState('currentPath', () => route.params.path || '/');

</script>

<style lang="scss" scoped>
.browsePageContainer{
    padding: var(--el-component-size-small);
    display: grid;
    grid-template-columns: min-content 1fr;
    gap : var(--el-component-size-small);
}
.treeContainer{
    min-width: 200px;
    background: var(--el-color-info-light-8);
}
</style>