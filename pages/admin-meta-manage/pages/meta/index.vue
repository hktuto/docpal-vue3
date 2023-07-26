<template>
    <NuxtLayout class="fit-height withPadding">
        <Table v-loading="state.loading" :columns="tableSetting.columns" :table-data="state._tableData"
                :options="state.options"
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
            <template #displayMeta="{ row }">
                <el-tag class="el-icon--left" v-for="(item, index) in row.displayMeta" :key="index">{{item.meta}}</el-tag>
            </template>
            <template #relatedDocument="{ row }">
                <el-tag class="el-icon--left" v-for="(item, index) in row.related" :key="index">{{item.type}}</el-tag>
            </template>
        </Table>
        <MetaAddDocTypeDialog ref="MetaAddDocTypeDialogRef" @refresh="getList()"></MetaAddDocTypeDialog>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { GetMetaSettingList, TABLE, defaultTableSetting, deepCopy } from 'dp-api'
// #region module: page
    const router = useRouter()
    const state = reactive<State>({
        loading: false,
        tableData: [],
        _tableData: [],
        options: {
            rowKey: 'documentType',
        }
    })
    const tableKey = TABLE.ADMIN_META_MANAGE
    const tableSetting = defaultTableSetting[tableKey]

    async function getList () {
        state.loading = true
        try {
            state.tableData = await GetMetaSettingList()
            console.log(state.tableData);
            
            state._tableData = deepCopy(state.tableData)
        } catch (error) {
            console.error(error)
        }
        state.loading = false
    }
// #endregion
const shareInfoDialogRef = ref()

function handleDblclick (row) {
    router.push(`/meta/${row.documentType}`)
}
async function handleSubmit (shareInfo) {
}
const MetaAddDocTypeDialogRef = ref()
function handleAdd() {
    MetaAddDocTypeDialogRef.value.handleOpen(state.tableData)
}
function handleKeywordFilter(data) {
    state._tableData = data
}
onMounted(async() => {
    getList()
})
</script>

<style lang="scss" scoped>
.pageContainer{
  height: 100%;
  padding: calc( var(--app-padding) * 2);
  position: relative;
}
.button-add {
    margin: 0 0 var(--app-padding) 0;
}
.filter-container {
    display: grid;
    grid-template-columns: 1fr min-content;
    gap: var(--app-padding);
}
</style>
