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
import { GetMetaSettingList, TABLE, defaultTableSetting } from 'dp-api'
// #region module: page
    const router = useRouter()
    const state = reactive<State>({
        loading: false,
        tableData: []
    })
    const tableKey = TABLE.ADMIN_META_MANAGE
    const tableSetting = defaultTableSetting[tableKey]

    async function getList () {
        state.loading = true
        state.tableData = await GetMetaSettingList()
        state.loading = false
    }

    const { tableData, loading } = toRefs(state)
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
onMounted(async() => {
    getList()
})
</script>

<style lang="scss" scoped>
.button-add {
    margin: 0 0 var(--app-padding) 0;
}
</style>