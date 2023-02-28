<template>
    <NuxtLayout >
        <Table v-loading="loading" :columns="tableColumn" :table-data="tableData" :options="options"
                @pagination-change="handlePaginationChange"
                @row-dblclick="handleDblclick"></Table>
        <Drawer ref="DrawerRef" :modal="false" pointerModal>
            test
        </Drawer>
    </NuxtLayout>
</template>


<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const pageParams = {
    pageIndex: 0,
    pageSize: 20
}
const state = reactive<State>({
    loading: false,
    tableData: [],
    options: { 
        showPagination: true, 
        paginationConfig: {
            total: 0,
            currentPage: 1,
            pageSize: pageParams.pageSize
        }
     }
})
const tableColumn = [
    { label: 'tableHeader_name', prop: 'name' },
    { label: 'tableHeader_path', prop: 'logicalPath' },
    { label: 'tableHeader_type', prop: 'type' },
    { label: 'trash_deleteBy', prop: 'properties.principalName' },
    { label: 'trash_date', prop: "properties.trashed_date", type: 'date' },
]
async function getList (param) {
    state.loading = true
    const res = await getTrashApi(param)
    state.tableData = res.entryList
    state.options.paginationConfig.total = res.totalSize
    state.options.paginationConfig.pageSize = param.pageSize
    state.options.paginationConfig.currentPage = param.pageIndex + 1
    state.loading = false
}
function handlePaginationChange (page: number, pageSize: number) {
    router.push({ 
        query: { page, pageSize } 
    })
}
watch(
    () => route.query,
    async (newval) => {
        const { page, pageSize } = newval
        pageParams.pageIndex = (Number(page) - 1) || 0
        pageParams.pageSize = Number(pageSize) || pageParams.pageSize
        getList(pageParams)
    },
    { immediate: true }
)
const { tableData, options, loading } = toRefs(state)

const DrawerRef = ref()
function handleDblclick () {
    console.log('test');
    
    DrawerRef.value.handleOpen()
}
</script>

<style lang="scss" scoped>
</style>