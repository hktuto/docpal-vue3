<template>
    <SmartFolderBrowseTable v-if="state.isBrowse"  v-bind="state"></SmartFolderBrowseTable>
    <NuxtLayout  v-else class="fit-height withPadding" backPath="/smartFolder" :pageTitle="$t('file_smartFolder')">
        <SmartFolderTable v-bind="state"></SmartFolderTable>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { sfolderGetApi, getSearchParamsArray } from 'dp-api'
const state = reactive({
    isBrowse: false,
    sfolder: null,
    breadcrumbs: [
        { path: '/smartFolder', icon: '/icons/home.svg'},
        { path: '/smartFolder', name: $t('file_smartFolder')}
    ],
    searchParams: {}
})
const route = useRoute()
async function getSfolder() {
    state.sfolder = JSON.parse(sessionStorage.getItem('smartFolder')) 
    if(!state.sfolder) {
        const sfolderList = await sfolderGetApi()
        state.sfolder = sfolderList.find(item => item.id === route.params.id)
    }
    state.breadcrumbs[1].name = state.sfolder.name
    state.breadcrumbs[1].path = `/smartFolder/${state.sfolder.id}`
    state.searchParams = getSearchParamsArray(JSON.parse(state.sfolder.json_value))
    if(Array.isArray(state.searchParams.paramsInTextSearch)) state.searchParams.paramsInTextSearch = state.searchParams.paramsInTextSearch.join(',')
}
watch(() =>route.query, (r) => {
    if(!!r.path) state.isBrowse = true
    else state.isBrowse = false
}, {
    immediate: true
})
onMounted(() => {
    getSfolder()
})
</script>

<style lang="scss" scoped>

</style>
