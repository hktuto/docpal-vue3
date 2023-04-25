<template>
    <NuxtLayout class="fit-height withPadding">
        <Table v-loading="loading" :columns="tableSetting.columns" :table-data="tableData"
                @row-dblclick="handleDblclick">
            <template #displayMeta="{ row }">
                <el-tag class="el-icon--left" v-for="(item, index) in row.displayMeta" :key="index">{{item.meta}}</el-tag>
            </template>
            <template #relatedDocument="{ row }">
                <el-tag class="el-icon--left" v-for="(item, index) in row.related" :key="index">{{item.type}}</el-tag>
            </template>
        </Table>
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
onMounted(async() => {
    getList()
})
</script>

<style lang="scss" scoped>
</style>