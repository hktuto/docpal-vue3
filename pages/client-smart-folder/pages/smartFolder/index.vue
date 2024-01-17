<template>
    <NuxtLayout class="fit-height ">
        <div class="smartFolder-container withPadding">
            <SmartFolderBreadCrumb :breadcrumbs="state.breadcrumbs"></SmartFolderBreadCrumb>
            <Table v-loading="loading" :columns="tableSetting.columns" :table-data="tableData" :options="options"
                    @command="handleAction"
                    @row-dblclick="handleDblclick">
                    <template #fileType> Smart Folder </template>
            </Table>
        </div>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { sfolderGetApi, TABLE, defaultTableSetting } from 'dp-api'
// #region module: page
    const route = useRoute()
    const router = useRouter()
    const tableKey = TABLE.CLIENT_SMART_FOLDER_LIST
    const tableSetting = defaultTableSetting[tableKey]
    const state = reactive<State>({
        loading: false,
        tableData: [],
        options: { 
            sortKey: tableKey,
        },
        breadcrumbs: [
            { path: '/smartFolder', icon: '/icons/home.svg'}
        ]
    })


    async function getList () {
        state.loading = true
        try {
            const res = await sfolderGetApi()
            state.tableData = res
        } catch (error) {

        }
        state.loading = false
    }
    function handleAction (command:sting, row: any, rowIndex: number) {
        switch(command) {
            case 'preview':
                handleDblclick(row)
                break
        }
    }
    const { tableData, options, loading } = toRefs(state)
// #endregion

function handleDblclick (row) {
    sessionStorage.setItem('smartFolder', JSON.stringify(row))
    router.push(`/smartFolder/${row.id}?time=0`)
}
onMounted(() => {
    getList()
})
</script>

<style lang="scss" scoped>
.smartFolder-container{
    display: grid;
    grid-template-rows: min-content 1fr;
    gap: var(--app-padding);
    height: 100%;
    overflow: hidden;
}
</style>
