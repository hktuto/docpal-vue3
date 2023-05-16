<template>
    <NuxtLayout class="fit-height withPadding">
        <Table v-loading="loading" :columns="tableSetting.columns" :table-data="tableData"
                @row-dblclick="handleDblclick">
            <template #preSortButton>
                <el-button class="button-add" type="primary"
                    @click="handleAdd()">{{$t('common_add')}}</el-button>
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
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { GetBulkImportConfigList, TABLE, defaultTableSetting } from 'dp-api'
// #region module: page
    const router = useRouter()
    const state = reactive<State>({
        loading: false,
        tableData: []
    })
    const tableKey = TABLE.ADMIN_BULK_IMPORT
    const tableSetting = defaultTableSetting[tableKey]

    async function getList () {
        state.loading = true
        state.tableData = await GetBulkImportConfigList()
        state.loading = false
    }

    const { tableData, loading } = toRefs(state)
// #endregion
const shareInfoDialogRef = ref()

function handleDblclick (row) {
    router.push(`/bulkImport/${row.documentType}`)
}
async function handleSubmit (shareInfo) {
}
function handleAdd() {}
onMounted(async() => {
    getList()
})
</script>

<style lang="scss" scoped>
.button-add {
    margin: 0 0 var(--app-padding) 0;
}
</style>