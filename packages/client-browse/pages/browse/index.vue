<template>
    <NuxtLayout >
        <page-container>
        <div v-if="data" class="browsePageContainer">
            <div class="browseHeader">
                <BrowseBreadcrumb ref="breadCrumb" :path="routePath" rootPath="/" />
                <div class="browseHeaderRight">
                    <Teleport :disabled="data.isFolder" to="body">
                        <BrowseActionsCopyPath :doc="data" />
                    </Teleport>
                </div>

            </div>
            <BrowseTable :path="routePath" :doc="data"/>
        </div>
        <Teleport v-if="data && !data.isFolder" to="body">
            <BrowseDetail :show="!data.isFolder" :doc="data" @close="detailClosed" />
        </Teleport>
        </page-container>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import {watch, ref, computed} from 'vue'
import { GetDocDetail, GetDocPermission } from 'dp-api'
const breadCrumb = ref();
const icon = ref("");
const route = useRoute();
const data = ref();
const loading = ref(false)

const permission = ref({permission:"",print:false});
const auth = useUser();

const routePath = computed( () => (route.query.path as string) || '/')

async function getPermission(){
    permission.value = await GetDocPermission(routePath.value, auth.user.value.username);
}
async function getDocDetail() {
     data.value = await GetDocDetail(routePath.value);
}
watch(route, async() => {
    loading.value = true;
    await Promise.all([
        getPermission(),
        getDocDetail()
    ])

    loading.value = false;
},{immediate:true});



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
.browseHeader{
    display: grid;
    grid-template-columns: 1fr min-content;
    justify-content: flex-start;
    align-items: center;

}
</style>
