<template>
    <NuxtLayout class="fit-height withPadding">
        <Table v-loading="loading" :columns="tableSetting.columns" :table-data="state._tableData"
                @command="handleAction"
                @row-dblclick="handleDblclick">
            <template #preSortButton>
                <div class="filter-container">
                    <KeywordFilter :list="state.tableData" attr="documentType"
                        @filter="handleKeywordFilter"></KeywordFilter>
                    <el-button class="button-add" type="primary"
                        @click="handleDialog()">{{$t('common_add')}}</el-button>
                </div>
            </template>
            <template #targetTypes="{ row }">
                <el-tag v-for="(item, index) in row.list" :key="index"
                    closable
                    @close="handleDelete(item)"
                    @click="handleDialog(item)">{{item.label}} ({{item.targetType}})
                </el-tag>
            </template>
        </Table>
        <DamDialog ref="DamDialogRef" @refresh="getList()"></DamDialog>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import { GetDamsApi, DeleteDamApi, TABLE, defaultTableSetting } from 'dp-api'
// #region module: page
    const router = useRouter()
    const state = reactive<State>({
        loading: false,
        tableData: [],
        _tableData: []
    })
    const tableKey = TABLE.ADMIN_DAM
    const tableSetting = defaultTableSetting[tableKey]

    async function getList () {
        state.loading = true
        state.tableData = await GetDamsApi()
        state._tableData = deepCopy(state.tableData)
        state.loading = false
    }
// #endregion
const shareInfoDialogRef = ref()

function handleDblclick (row) {
}
async function handleSubmit (shareInfo) {
}
const DamDialogRef = ref()
function handleDialog(data) {
    DamDialogRef.value.handleOpen(deepCopy(data))
}
function handleKeywordFilter(data) {
    state._tableData = data
}
const handleAction = (command: Table.Command, row: any, index: number) => {
    switch (command) {
        case 'add':
            handleDialog(row)
            break
    }
}
async function handleDelete (tag) {
    ElMessageBox.confirm(`${$i18n.t('msg_confirmWhetherToDelete')}`)
    .then(async() => {
        console.log({tag});
        await DeleteDamApi([tag.id])
        getList()
    })
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
.el-tag +.el-tag {
    margin-left: var(--app-padding);
}
</style>