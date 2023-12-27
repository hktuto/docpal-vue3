<template>
    <NuxtLayout class="fit-height withPadding">
        <Table v-loading="state.loading" :columns="tableSetting.columns" :table-data="state._tableData"
                :options="state.options"
                @row-dblclick="handleDblclick"
                @command="handleAction">
            <template #preSortButton>
                <ResponsiveFilter ref="ResponsiveFilterRef" inputKey="name" @form-change="handleFilterFormChange"/>
            </template>
            <template #icon="{ row }">
                <BrowseItemIcon class="el-icon--left" :type="row.isFolder ? 'folder' : 'file'"/>
            </template>
        </Table>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { getDocTypeListApi, TABLE, defaultTableSetting, deepCopy } from 'dp-api'
// #region module: page
    const router = useRouter()
    const state = reactive<State>({
        loading: false,
        tableData: [],
        _tableData: [],
        options: {
            rowKey: 'name',
        }
    })
    const tableKey = TABLE.ADMIN_META_VALIDATION
    const tableSetting = defaultTableSetting[tableKey]

    async function getList () {
        state.loading = true
        try {
            state.tableData = await getDocTypeListApi()
            state._tableData = deepCopy(state.tableData)
        } catch (error) {
            console.error(error)
        }
        state.loading = false
    }
// #endregion
const shareInfoDialogRef = ref()

function handleDblclick (row) {
    router.push(`/meta-validation/${row.name}`)
}
async function handleSubmit (shareInfo) {
}
function handleAction (command:sting, row: any, rowIndex: number) {
    switch (command) {
        case 'edit':
            handleDblclick(row)
            break
    }
}
function handleKeywordFilter(data) {
    state._tableData = data
}
// #region module: ResponsiveFilterRef
    const ResponsiveFilterRef = ref()
    async function getFilter() {
        const filters = [
            { key: "isFolder", label: $t('doc.isFolder'), type: "string", isMultiple: false,
                options: [
                    { value: 'file', label: $t('tip.false') },
                    { value: 'folder', label: $t('tip.true') },
                    // { value: "both", label: $t('tip.both') },
                ]
            },
        ]
        ResponsiveFilterRef.value.init(filters)
    }
    function handleFilterFormChange(formModel) {
        const isFolder = formModel.isFolder === 'folder'
        state._tableData = state.tableData.filter(item => {
            return (formModel.name === undefined || 
                    item.name.toLowerCase().includes(formModel.name.toLowerCase())) 
                && (formModel.isFolder === undefined || 
                    item.isFolder === isFolder)
        })
    }
// #endregion
onMounted(async() => {
    getList()
    setTimeout(() => {
        getFilter()
    }, 100)
})
</script>

<style lang="scss" scoped>
:deep(.tableHeader) {
    margin-bottom: 10px;
    & > .el-button {
        margin: unset;
    }
}
.button-add {
    margin: 0 0 var(--app-padding) 0;
}
.filter-container {
    display: flex;
    width: 100%;
    gap: var(--app-padding);
    margin-bottom: var(--app-padding);
}
</style>
