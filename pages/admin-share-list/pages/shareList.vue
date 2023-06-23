<template>
    <NuxtLayout class="fit-height withPadding">
      <div class="pageContainer">


        <Table v-loading="loading" :columns="tableSetting.columns" :table-data="tableData" :options="options"
                @pagination-change="handlePaginationChange"
                @command="handleAction"
                @row-dblclick="handleDblclick"></Table>
        <ShareInfoDialog ref="shareInfoDialogRef" @submit="handleSubmit"></ShareInfoDialog>
      </div>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from 'element-plus'
import { RefreshLeft, Delete } from '@element-plus/icons-vue'
import { getShareListApi, deleteShareListApi, patchShareInfoApi, TABLE, defaultTableSetting } from 'dp-api'
const { t } = useI18n();
// #region module: page
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
    const tableKey = TABLE.CLIENT_SHARE_LIST
    const tableSetting = defaultTableSetting[tableKey]

    async function getList (param) {
        state.loading = true
        try {
            const res = await getShareListApi(param)
            state.tableData = res.entryList
            state.options.paginationConfig.total = res.totalSize
            state.options.paginationConfig.pageSize = param.size
            state.options.paginationConfig.currentPage = param.page + 1
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
    function handleAction (command:sting, row: any, rowIndex: number) {
        switch (command) {
            case 'disabled':
                handleDisabled(row)
                break
        }
    }
    function handleDisabled (row) {
        ElMessageBox.confirm(`${t('msg_confirmWhetherToDelete')}`)
            .then(async() => {
                const param = []
                param.push(row.shareID)
                await deleteShareListApi(param)
                handlePaginationChange(pageParams.pageIndex - 1, pageParams.pageSize)
            })
    }
    watch(
        () => route.query,
        async (newval) => {
            const { page, pageSize } = newval
            dpLog({pageSize});

            pageParams.pageIndex = (Number(page) - 1) > 0 ? (Number(page) - 1) : 0
            pageParams.pageSize = Number(pageSize) || pageParams.pageSize
            getList({page: pageParams.pageIndex, size: pageParams.pageSize})
        },
        { immediate: true }
    )
    const { tableData, options, loading } = toRefs(state)
// #endregion
const shareInfoDialogRef = ref()

function handleDblclick (row) {
    shareInfoDialogRef.value.handleOpen(row)
}
async function handleSubmit (shareInfo) {
    await patchShareInfoApi(shareInfo)
    handlePaginationChange(pageParams.pageIndex, pageParams.pageSize)
}

</script>

<style lang="scss" scoped>
.pageContainer{
  height: 100%;
  padding: calc( var(--app-padding) * 2);
  position: relative;
}
</style>
