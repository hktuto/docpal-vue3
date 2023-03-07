<template>
    <NuxtLayout class="fit-height withPadding">
        <el-container>
            <el-aside width="200px">
                <div class="collection-list" style="--color: #F56C6C">
                    <div v-for="item in collectionList" :class="['collection-item','cursorPointer', {'current': tabName === item.id}]" @click="handleTabClick(item.id)">
                        <span class="ellipsis" :title="item.name">{{item.name}}</span>
                        <el-icon class="color__danger__hover cursorPointer"
                            @click.stop="handleDelete(item)"><Delete /></el-icon>
                    </div>
                </div>
                <el-button>{{$t('add')}}</el-button>
            </el-aside>
            <el-main class="">
                    <Table v-loading="loading" :columns="tableSetting.columns" :table-data="tableData" :options="options"
                        @pagination-change="handlePaginationChange"
                        @command="handleAction"
                        @row-dblclick="handleDblclick"></Table>
            </el-main>
        </el-container>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { getCollectionApi, DeleteByIdApi, removeCollectionApi, getCollectionDoc, TABLE, defaultTableSetting } from 'dp-api'
const { t } = useI18n();
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
        // showPagination: true, 
        paginationConfig: {
            total: 0,
            currentPage: 1,
            pageSize: pageParams.pageSize
        }
    },
    collectionList: [],
    tabName: ''
})

// #region module: collectionList
    async function getCollectionList () {
        const res = await getCollectionApi()
        state.collectionList = res.entryList
        if(state.collectionList.length > 0) {
            let index = state.collectionList.findIndex(item => item.id === route.query.tab)
            if (index === -1) index = 0
            handleTabClick(state.collectionList[index].id)
        }
    }
    function handleTabClick(tab) {
        state.tabName = tab
        const time = new Date().valueOf().toString() + 1
        router.push({ 
            query: { tab, page: 0, pageSize: pageParams.pageSize, time } 
        })
    }
    function handleDelete(row) {
        ElMessageBox.confirm(`${t('msg_confirmWhetherToDelete')}`)
            .then(async() => {
                const res = await DeleteByIdApi(row.id)
                console.log(res);
                getCollectionList()
            })
    }
// #endregion

// #region module: page
    const tableKey = TABLE.CLIENT_COLLECTION
    const tableSetting = defaultTableSetting[tableKey]
    async function getList (param, tab) {
        state.loading = true
        const res = await getCollectionDoc(state.tabName)
        state.tableData = res.entryList
        state.options.paginationConfig.total = res.totalSize
        state.options.paginationConfig.pageSize = param.pageSize
        state.options.paginationConfig.currentPage = param.pageIndex + 1
        state.loading = false
    }
    function handlePaginationChange (page: number, pageSize: number) {
        if(!pageSize) pageSize = pageParams.pageSize
        const time = new Date().valueOf().toString()
        router.push({ 
            query: { tab: state.tabName, page, pageSize, time } 
        })
    }
    watch(
        () => route.query,
        async (newval) => {
            if (state.collectionList.length === 0) return
            const { page, pageSize, tab } = newval
            if (tab) {
                pageParams.pageIndex = (Number(page) - 1) || 0
                pageParams.pageSize = Number(pageSize) || pageParams.pageSize
                getList(pageParams, tab)
            }
        }
    )
// #endregion
// #region module: collection doc
    function handleDocDelete(row) {
        ElMessageBox.confirm(`${t('msg_confirmWhetherToDelete')}`)
            .then(async() => {
                const res = await removeCollectionApi(row.id)
                console.log(res);
                // getCollectionList()
            })
    }
// #endregion
function handleDblclick (row) {
    router.push({
        path: '/browse',
        query: {
            path: row.path,
        },
    })
}
function handleAction (command, row: any, index: number) {
    switch (command) {
        case 'delete':
            handleDocDelete(row)
            break
        default:
            break
    }
}
const { tableData, options, loading, collectionList, tabName } = toRefs(state)
onMounted(() => {
    getCollectionList()
})
</script>

<style lang="scss" scoped>
.grid-layout {
    display: grid;
    grid-template-rows: min-content 1fr;
    height: 100%;
    overflow: hidden;
}
.current {
    background-color: aqua;
}
.el-container {
    height: 100%;
    overflow: hidden;
}
.el-aside {
    display: grid;
    grid-template-rows: 1fr min-content;
    height: 100%;
    overflow: hidden;
    gap: var(--app-padding);
    .collection-list {
        overflow: auto;
    }
    .collection-item {
        padding: var(--app-padding);
        display: grid;
        grid-template-columns: 1fr min-content;
        gap: var(--app-padding);
    }
}
.el-main {
    padding: 0 var(--app-padding);
}
</style>
