<template>
    <NuxtLayout class="fit-height withPadding">
        <Table v-loading="loading" :columns="tableSetting.columns" :table-data="tableData" :options="options"
                @pagination-change="handlePaginationChange"
                @row-dblclick="handleDblclick">
        </Table>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from 'element-plus'
import { RefreshLeft, Delete } from '@element-plus/icons-vue'
import { getFileRequestListApi, deleteShareListApi, patchShareInfoApi, TABLE, defaultTableSetting } from 'dp-api'
const { t } = useI18n();
// #region module: page
    const route = useRoute()
    const router = useRouter()
    const pageParams = {
        pageIndex: 0,
        pageSize: 20
    }
  const tableKey = TABLE.CLIENT_FILE_REQUEST
  const tableSetting = defaultTableSetting[tableKey]
    const state = reactive<State>({
        loading: false,
        tableData: [],
        options: {
            showPagination: true,
            paginationConfig: {
                total: 0,
                currentPage: 1,
                pageSize: pageParams.pageSize
            },
            sortKey: tableKey,
            rowStyle ({row, index}) {
                if(row.status !== 'pending_approval') {
                    return 'background-color: #CDD0D6!important'
                } else {
                    return ''
                }
            }
        }
    })


    async function getList (param) {
        state.loading = true
        try {
            const res = await getFileRequestListApi(param)
            state.tableData = res.entryList
            state.options.paginationConfig.total = res.totalSize
            state.options.paginationConfig.pageSize = param.pageSize
            state.options.paginationConfig.currentPage = param.pageIndex + 1
        } catch (error) {

        }
        state.loading = false
    }
    function handlePaginationChange (page: number, pageSize: number) {
        if(!pageSize) pageSize = pageParams.pageSize
        const time = new Date().valueOf().toString()
        router.push({
            query: { page, pageSize, time }
        })
    }

    watch(
        () => route.query,
        async (newval) => {
            const { page, pageSize } = newval
            pageParams.pageIndex = (Number(page) - 1) > 0 ? (Number(page) - 1) : 0
            pageParams.pageSize = Number(pageSize) || pageParams.pageSize
            getList(pageParams)
        },
        { immediate: true }
    )
    const { tableData, options, loading } = toRefs(state)
// #endregion

function handleDblclick (row) {
    if (row.status === 'pending_approval') {
        router.push(`/fileRequest/${row.taskId}`)
    }
}
</script>

<style lang="scss" scoped>
.pageContainer{
  padding: calc(var(--app-padding) * 2 );
  position: relative;
  height: 100%;
}
</style>
