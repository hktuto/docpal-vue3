<template>
<el-card v-loading="state.loading">
    <template #header>
        <div class="card-header">
            <span>{{$t('docType_releatedDocument')}}</span>
            <el-button class="button" type="primary"
                @click="handleDialogShow()">{{$t('common_add')}}</el-button>
        </div>
    </template>
    <Table :columns="tableSetting.columns" :table-data="state._list"
        :options="{ rowKey: 'type' }"
        @row-dblclick="handleDblclick"
        @command="handleAction">  
    </Table>
    <MetaRelatedTypeDialog ref="MetaDisplayMetaDialogRef" @refresh="getTable"></MetaRelatedTypeDialog>
</el-card>
</template>


<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
    GetMetaSettingApi,
    SaveMetaValidationRuleApi,
    DeleteRelatedTypeApi,
    TABLE, defaultTableSetting
} from 'dp-api'
const state = reactive({
    loading: false,
    list: [],
    _list: [],
})
const route = useRoute()
const router = useRouter()
const tableKey = TABLE.ADMIN_META_RELATED
const tableSetting = defaultTableSetting[tableKey]
function handleDblclick (row) {
    handleDialogShow(row)
    // router.push(`/userManage/user?id=${row.userId}`)
}
function handleAction (command:sting, row: any, rowIndex: number) {
    switch (command) {
        case 'delete':
            handleDelete(row)
            break
    }
}
async function handleDelete(row) {
    ElMessageBox.confirm(`${$i18n.t('msg_confirmWhetherToDelete')}`)
        .then(async() => {
            state.loading = true
            const res = await DeleteRelatedTypeApi(row, route.params.id)
            await getTable()
            state.loading = false
        })
}
const MetaDisplayMetaDialogRef = ref()
function handleDialogShow(data) {
    MetaDisplayMetaDialogRef.value.handleOpen(state.list, data)
}

async function getTable() {
    const docType = await GetMetaSettingApi(route.params.id)
    state.list = docType.related
    state._list = state.list
}
onMounted(async() => {
    getTable()
})
</script>

<style lang="scss" scoped>
.el-card {
    display: grid;
    grid-template-rows: min-content 1fr;
    :deep(.el-card__body) {
        overflow: auto;
    }
    .card-header {
        display: flex;
        justify-content: space-between;
    }
}
</style>