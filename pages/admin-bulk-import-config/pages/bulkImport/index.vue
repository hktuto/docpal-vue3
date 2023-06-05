<template>
    <NuxtLayout class="fit-height withPadding">
        <Table v-loading="loading" :columns="tableSetting.columns" :table-data="state._tableData"
                @row-dblclick="handleDblclick">
            <template #preSortButton>
                <div class="filter-container">
                    <KeywordFilter :list="state.tableData" attr="documentType"
                        @filter="handleKeywordFilter"></KeywordFilter>
                    <el-button class="button-add" type="primary"
                        @click="handleAdd()">{{$t('common_add')}}</el-button>
                </div>
            </template>
            <template #icon="{ row }">
                <BrowseItemIcon class="el-icon--left" :type="row.isFolder ? 'folder' : 'file'"/>
            </template>
            <template #metaMapping="{ row }">
                <el-tag class="el-icon--left" v-for="(value, key) in row.mappingMeta" :key="key">{{value}}</el-tag>
            </template>
            <template #bulkImportConfig="{ row }">
                <el-tag class="el-icon--left" v-for="(item, index) in row.bulkImportConfigs" :key="index">{{item}}</el-tag>
            </template>
        </Table>
        <MetaAddDocTypeDialog ref="MetaAddDocTypeDialogRef" @refresh="getList()"></MetaAddDocTypeDialog>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { set } from '@vueuse/core'
import { GetBulkImportConfigList, TABLE, defaultTableSetting, deepCopy } from 'dp-api'
// #region module: page
    const router = useRouter()
    const state = reactive<State>({
        loading: false,
        tableData: [],
        _tableData: []
    })
    const tableKey = TABLE.ADMIN_BULK_IMPORT
    const tableSetting = defaultTableSetting[tableKey]

    async function getList () {
        state.loading = true
        try {
            state.tableData = await GetBulkImportConfigList()
            state._tableData = deepCopy(state.tableData)
        } catch (error) {
            
        }
        state.loading = false
    }

    const { tableData, loading } = toRefs(state)
// #endregion
const shareInfoDialogRef = ref()

function handleDblclick (row) {
    router.push(`/bulkImport/${row.documentType}`)
}
function handleKeywordFilter(data) {
    state._tableData = data
}
async function handleSubmit (shareInfo) {
}
const MetaAddDocTypeDialogRef = ref()
function handleAdd() {
    MetaAddDocTypeDialogRef.value.handleOpen(state.tableData)
}
onMounted(async() => {
    getList()
})
</script>

<style lang="scss" scoped>
.button-add {
    margin: 0 0 var(--app-padding) 0;
}
.filter-container {
    display: grid;
    grid-template-columns: 1fr min-content;
    gap: var(--app-padding);
}
</style>